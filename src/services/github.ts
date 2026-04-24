const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'GilvanPOliveira'
const REPOS_CACHE_KEY = `portfolio:github:repos:v2:${GITHUB_USERNAME}`
const README_CACHE_PREFIX = `portfolio:github:readme:${GITHUB_USERNAME}:`
const REPO_PROJECTS_CACHE_PREFIX = `portfolio:github:repo-projects:v2:${GITHUB_USERNAME}:`
const REPOS_CACHE_TTL = 1000 * 60 * 30
const README_CACHE_TTL = 1000 * 60 * 60 * 6
const REPO_PROJECTS_CACHE_TTL = 1000 * 60 * 60 * 6

type CacheEntry<T> = {
  timestamp: number
  data: T
}

export type GitHubRepo = {
  id: number
  name: string
  slug: string
  description: string
  language: string
  stargazersCount: number
  forksCount: number
  createdAt: string
  updatedAt: string
  htmlUrl: string
  homepage: string
  defaultBranch: string
}

export type GitHubRepoProject = {
  id: string
  name: string
  slug: string
  path: string
  description: string
  deployUrl: string
  htmlUrl: string
  readme: string
}

type GitHubRepoApiResponse = {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  html_url: string
  homepage: string | null
  default_branch: string
  fork: boolean
  archived: boolean
}

type GitHubTreeApiResponse = {
  tree: Array<{
    path: string
    type: 'blob' | 'tree'
  }>
  truncated: boolean
}

type GitHubPortfolioStaticData = {
  repos: GitHubRepo[]
  readmesByRepo: Record<string, string>
  repoProjectsByRepo: Record<string, GitHubRepoProject[]>
}

const memoryCache = new Map<string, CacheEntry<unknown>>()
let staticPortfolioDataPromise: Promise<GitHubPortfolioStaticData | null> | null = null

function buildHeaders(): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function isFresh(entry: CacheEntry<unknown>, ttl: number) {
  return Date.now() - entry.timestamp < ttl
}

function readCache<T>(key: string, ttl: number) {
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined

  if (memoryEntry && isFresh(memoryEntry, ttl)) {
    return memoryEntry.data
  }

  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.sessionStorage.getItem(key)

    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue) as CacheEntry<T>

    if (!isFresh(parsedValue, ttl)) {
      window.sessionStorage.removeItem(key)
      return null
    }

    memoryCache.set(key, parsedValue)
    return parsedValue.data
  } catch {
    return null
  }
}

function writeCache<T>(key: string, data: T) {
  const entry: CacheEntry<T> = {
    timestamp: Date.now(),
    data,
  }

  memoryCache.set(key, entry)

  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
  }
}

async function fetchStaticPortfolioData() {
  if (staticPortfolioDataPromise) {
    return staticPortfolioDataPromise
  }

  staticPortfolioDataPromise = fetch('/github-portfolio.json', {
    cache: 'no-cache',
  })
    .then((response) => {
      if (!response.ok) {
        return null
      }

      return response.json() as Promise<GitHubPortfolioStaticData>
    })
    .catch(() => null)

  return staticPortfolioDataPromise
}

async function githubFetch<T>(input: string): Promise<T> {
  const response = await fetch(input, {
    headers: buildHeaders(),
  })

  if (!response.ok) {
    if (response.status === 403) {
      const remaining = response.headers.get('x-ratelimit-remaining')
      const reset = response.headers.get('x-ratelimit-reset')

      if (remaining === '0') {
        const resetDate = reset ? new Date(Number(reset) * 1000).toLocaleString('pt-BR') : ''

        throw new Error(
          resetDate
            ? `Limite de requisições do GitHub atingido. Tente novamente após ${resetDate}.`
            : 'Limite de requisições do GitHub atingido.',
        )
      }

      throw new Error('GitHub retornou 403 ao carregar os dados públicos do portfólio.')
    }

    if (response.status === 404) {
      throw new Error('Conteúdo não encontrado no GitHub.')
    }

    throw new Error(`Erro ao consultar GitHub: ${response.status}`)
  }

  return response.json() as Promise<T>
}

function normalizeRepo(repo: GitHubRepoApiResponse): GitHubRepo {
  return {
    id: repo.id,
    name: repo.name,
    slug: repo.name.toLowerCase(),
    description: repo.description?.trim() || 'Sem descrição cadastrada.',
    language: repo.language || '',
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    htmlUrl: repo.html_url,
    homepage: repo.homepage?.trim() || '',
    defaultBranch: repo.default_branch || 'main',
  }
}

function formatProjectName(value: string) {
  return decodeURIComponent(value)
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function slugifyProjectPath(path: string) {
  return path
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanMarkdownText(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitle(readme: string, fallback: string) {
  const heading = readme
    .split('\n')
    .map((line) => line.trim())
    .find((line) => /^#{1,2}\s+\S/.test(line))

  return heading ? cleanMarkdownText(heading.replace(/^#{1,2}\s+/, '')) : formatProjectName(fallback)
}

function extractDescription(readme: string) {
  const lines = readme.split('\n')
  let insideCodeBlock = false

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock
      continue
    }

    if (
      insideCodeBlock ||
      !line ||
      line === '##' ||
      line.startsWith('#') ||
      line.startsWith('|') ||
      line.startsWith('![') ||
      /^[-*]\s+\[/.test(line) ||
      /^[-*]\s*$/.test(line)
    ) {
      continue
    }

    const description = cleanMarkdownText(line)

    if (description.length >= 24) {
      return description.length > 180 ? `${description.slice(0, 177).trim()}...` : description
    }
  }

  return 'Projeto publicado com deploy disponível.'
}

function normalizeUrl(url: string) {
  return url.replace(/[),.;\]]+$/g, '').trim()
}

function isDeployUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    const normalizedHost = hostname.toLowerCase()

    if (
      normalizedHost === 'github.com' ||
      normalizedHost.endsWith('.github.com') ||
      normalizedHost.includes('shields.io') ||
      normalizedHost.includes('skillicons.dev') ||
      normalizedHost.includes('imgur.com')
    ) {
      return false
    }

    return [
      'github.io',
      'vercel.app',
      'netlify.app',
      'render.com',
      'onrender.com',
      'firebaseapp.com',
      'web.app',
      'surge.sh',
    ].some((domain) => normalizedHost === domain || normalizedHost.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

function extractDeployUrl(readme: string) {
  const markdownLinks = [...readme.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi)]
    .map((match) => ({
      label: match[1].toLowerCase(),
      url: normalizeUrl(match[2]),
    }))
    .filter((link) => isDeployUrl(link.url))

  const preferredLink = markdownLinks.find((link) =>
    /deploy|demo|preview|site|live|ver|acesse|aplicacao|aplicação|projeto/.test(link.label),
  )

  if (preferredLink) {
    return preferredLink.url
  }

  if (markdownLinks.length) {
    return markdownLinks[0].url
  }

  const bareUrl = [...readme.matchAll(/\bhttps?:\/\/[^\s<>)]+/gi)]
    .map((match) => normalizeUrl(match[0]))
    .find(isDeployUrl)

  return bareUrl || ''
}

async function fetchRawFile(repoName: string, path: string, branch: string) {
  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  const response = await fetch(
    `${GITHUB_RAW_BASE}/${GITHUB_USERNAME}/${repoName}/${encodeURIComponent(branch)}/${encodedPath}`,
  )

  if (!response.ok) {
    return ''
  }

  return response.text()
}

export async function fetchGitHubRepos(forceRefresh = false): Promise<GitHubRepo[]> {
  if (!forceRefresh) {
    const staticData = await fetchStaticPortfolioData()

    if (staticData?.repos?.length) {
      return staticData.repos
    }
  }

  const cachedRepos = !forceRefresh ? readCache<GitHubRepo[]>(REPOS_CACHE_KEY, REPOS_CACHE_TTL) : null

  if (cachedRepos) {
    return cachedRepos
  }

  const repos = await githubFetch<GitHubRepoApiResponse[]>(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=created`,
  )

  const normalizedRepos = repos
    .filter((repo) => !repo.fork && !repo.archived && !repo.name.endsWith('.github.io'))
    .map(normalizeRepo)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  writeCache(REPOS_CACHE_KEY, normalizedRepos)

  return normalizedRepos
}

export async function fetchGitHubRepoProjects(
  repo: GitHubRepo,
  forceRefresh = false,
): Promise<GitHubRepoProject[]> {
  if (!forceRefresh) {
    const staticData = await fetchStaticPortfolioData()
    const staticProjects = staticData?.repoProjectsByRepo?.[repo.name.toLowerCase()]

    if (staticProjects) {
      return staticProjects
    }
  }

  const cacheKey = `${REPO_PROJECTS_CACHE_PREFIX}${repo.name.toLowerCase()}`
  const defaultBranch = repo.defaultBranch || 'main'
  const cachedProjects = !forceRefresh
    ? readCache<GitHubRepoProject[]>(cacheKey, REPO_PROJECTS_CACHE_TTL)
    : null

  if (cachedProjects) {
    return cachedProjects
  }

  const tree = await githubFetch<GitHubTreeApiResponse>(
    `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/git/trees/${encodeURIComponent(
      defaultBranch,
    )}?recursive=1`,
  )

  if (tree.truncated) {
    writeCache(cacheKey, [])
    return []
  }

  const readmePaths = tree.tree
    .filter((item) => item.type === 'blob' && /(^|\/)readme\.md$/i.test(item.path))
    .filter((item) => item.path.includes('/'))
    .filter((item) => !isDependencyPath(item.path))
    .map((item) => item.path)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const projects = (
    await Promise.all(
      readmePaths.map(async (readmePath) => {
        const readme = await fetchRawFile(repo.name, readmePath, defaultBranch)
        const deployUrl = extractDeployUrl(readme)

        if (!readme || !deployUrl) {
          return null
        }

        const projectPath = readmePath.replace(/\/readme\.md$/i, '')
        const projectSlug = slugifyProjectPath(projectPath)
        const fallbackName = projectPath.split('/').at(-1) || projectPath

        return {
          id: `${repo.id}:${projectPath}`,
          name: extractTitle(readme, fallbackName),
          slug: projectSlug,
          path: projectPath,
          description: extractDescription(readme),
          deployUrl,
          htmlUrl: `${repo.htmlUrl}/tree/${encodeURIComponent(defaultBranch)}/${projectPath
            .split('/')
            .map((part) => encodeURIComponent(part))
            .join('/')}`,
          readme,
        } satisfies GitHubRepoProject
      }),
    )
  ).filter((project): project is GitHubRepoProject => Boolean(project))

  const leafProjects = filterLeafProjects(projects)

  writeCache(cacheKey, leafProjects)

  return leafProjects
}

function isDependencyPath(path: string) {
  return path
    .split('/')
    .map((part) => part.toLowerCase())
    .some((part) => ['node_modules', 'vendor', '.venv', 'venv'].includes(part))
}

function filterLeafProjects(projects: GitHubRepoProject[]) {
  return projects.filter(
    (project) => !projects.some((candidate) => candidate.path.startsWith(`${project.path}/`)),
  )
}

export async function fetchGitHubReadme(
  repoName: string,
  forceRefresh = false,
): Promise<string> {
  if (!forceRefresh) {
    const staticData = await fetchStaticPortfolioData()
    const staticReadme = staticData?.readmesByRepo?.[repoName.toLowerCase()]

    if (staticReadme) {
      return staticReadme
    }
  }

  const cacheKey = `${README_CACHE_PREFIX}${repoName.toLowerCase()}`
  const cachedReadme = !forceRefresh ? readCache<string>(cacheKey, README_CACHE_TTL) : null

  if (cachedReadme) {
    return cachedReadme
  }

  const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
    headers: {
      ...buildHeaders(),
      Accept: 'application/vnd.github.raw+json',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return 'README não encontrado para este repositório.'
    }

    if (response.status === 403) {
      throw new Error('GitHub bloqueou temporariamente a leitura do README deste projeto.')
    }

    throw new Error(`Erro ao carregar README: ${response.status}`)
  }

  const readme = await response.text()
  writeCache(cacheKey, readme)

  return readme
}

export function formatGitHubDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
