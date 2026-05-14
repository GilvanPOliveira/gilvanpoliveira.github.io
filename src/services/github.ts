const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'GilvanPOliveira'
const REPOS_CACHE_KEY = `portfolio:github:repos:v2:${GITHUB_USERNAME}`
const README_CACHE_PREFIX = `portfolio:github:readme:${GITHUB_USERNAME}:`
const REPO_PROJECTS_CACHE_PREFIX = `portfolio:github:repo-projects:v2:${GITHUB_USERNAME}:`
const PUBLIC_GITHUB_CACHE_TTL = 1000 * 60 * 5
const REPOS_CACHE_TTL = PUBLIC_GITHUB_CACHE_TTL
const README_CACHE_TTL = PUBLIC_GITHUB_CACHE_TTL
const REPO_PROJECTS_CACHE_TTL = PUBLIC_GITHUB_CACHE_TTL
const STACK_SUMMARY_CACHE_TTL = PUBLIC_GITHUB_CACHE_TTL
const STACK_SUMMARY_CACHE_KEY = `portfolio:github:stack-summary:v1:${GITHUB_USERNAME}`

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

type GitHubRepoLanguagesApiResponse = Record<string, number>

type GitHubPortfolioStaticData = {
  generatedAt?: string
  username?: string
  repos: GitHubRepo[]
  readmesByRepo: Record<string, string>
  repoProjectsByRepo: Record<string, GitHubRepoProject[]>
}

export type GitHubStackItem = {
  label: string
  icon: string
}

export type GitHubStackGroup = {
  title: string
  items: GitHubStackItem[]
}

export type GitHubStackSummary = {
  recent: GitHubStackItem[]
  studiedGroups: GitHubStackGroup[]
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
  const cachedRepos = !forceRefresh ? readCache<GitHubRepo[]>(REPOS_CACHE_KEY, REPOS_CACHE_TTL) : null

  if (cachedRepos) {
    return cachedRepos
  }

  try {
    const repos = await githubFetch<GitHubRepoApiResponse[]>(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=created`,
    )

    const normalizedRepos = repos
      .filter((repo) => !repo.fork && !repo.archived && !repo.name.endsWith('.github.io'))
      .map(normalizeRepo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    writeCache(REPOS_CACHE_KEY, normalizedRepos)

    return normalizedRepos
  } catch (error) {
    const staticData = await fetchStaticPortfolioData()

    if (staticData?.repos?.length) {
      return staticData.repos
    }

    throw error
  }
}

export async function fetchGitHubRepoProjects(
  repo: GitHubRepo,
  forceRefresh = false,
): Promise<GitHubRepoProject[]> {
  const cacheKey = `${REPO_PROJECTS_CACHE_PREFIX}${repo.name.toLowerCase()}`
  const defaultBranch = repo.defaultBranch || 'main'
  const cachedProjects = !forceRefresh
    ? readCache<GitHubRepoProject[]>(cacheKey, REPO_PROJECTS_CACHE_TTL)
    : null

  if (cachedProjects) {
    return cachedProjects
  }

  try {
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
  } catch (error) {
    const staticData = await fetchStaticPortfolioData()
    const staticProjects = staticData?.repoProjectsByRepo?.[repo.name.toLowerCase()]

    if (staticProjects) {
      return staticProjects
    }

    throw error
  }
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
  const cacheKey = `${README_CACHE_PREFIX}${repoName.toLowerCase()}`
  const cachedReadme = !forceRefresh ? readCache<string>(cacheKey, README_CACHE_TTL) : null

  if (cachedReadme) {
    return cachedReadme
  }

  try {
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
  } catch (error) {
    const staticData = await fetchStaticPortfolioData()
    const staticReadme = staticData?.readmesByRepo?.[repoName.toLowerCase()]

    if (staticReadme) {
      return staticReadme
    }

    throw error
  }
}

const knownStacks = [
  { label: 'HTML5', icon: 'html', group: 'Front-end', aliases: ['html', 'html5'] },
  { label: 'CSS', icon: 'css', group: 'Estilização', aliases: ['css', 'css3'] },
  { label: 'Sass', icon: 'sass', group: 'Estilização', aliases: ['sass', 'scss'] },
  { label: 'Tailwind CSS', icon: 'tailwind', group: 'Estilização', aliases: ['tailwind', 'tailwindcss'] },
  { label: 'Bootstrap', icon: 'bootstrap', group: 'Estilização', aliases: ['bootstrap'] },
  { label: 'Styled Components', icon: 'styledcomponents', group: 'Estilização', aliases: ['styledcomponents', 'styled components'] },
  { label: 'JavaScript', icon: 'js', group: 'Front-end', aliases: ['javascript', 'js'] },
  { label: 'TypeScript', icon: 'ts', group: 'Front-end', aliases: ['typescript', 'ts'] },
  { label: 'Vue', icon: 'vue', group: 'Front-end', aliases: ['vue', 'vuejs', 'vue.js'] },
  { label: 'React', icon: 'react', group: 'Front-end', aliases: ['react', 'reactjs', 'react.js'] },
  { label: 'Angular', icon: 'angular', group: 'Front-end', aliases: ['angular'] },
  { label: 'Next.js', icon: 'nextjs', group: 'Front-end', aliases: ['nextjs', 'next.js'] },
  { label: 'jQuery', icon: 'jquery', group: 'Front-end', aliases: ['jquery'] },
  { label: 'Python', icon: 'python', group: 'Back-end', aliases: ['python', 'py'] },
  { label: 'Flask', icon: 'flask', group: 'Back-end', aliases: ['flask'] },
  { label: 'FastAPI', icon: 'fastapi', group: 'Back-end', aliases: ['fastapi', 'fast api'] },
  { label: 'Node.js', icon: 'nodejs', group: 'Back-end', aliases: ['node', 'nodejs', 'node.js'] },
  { label: 'Java', icon: 'java', group: 'Back-end', aliases: ['java'] },
  { label: 'PHP', icon: 'php', group: 'Back-end', aliases: ['php'] },
  { label: 'C', icon: 'c', group: 'Back-end', aliases: ['c'] },
  { label: 'C++', icon: 'cpp', group: 'Back-end', aliases: ['c++', 'cpp'] },
  { label: 'C#', icon: 'cs', group: 'Back-end', aliases: ['c#', 'csharp'] },
  { label: 'PostgreSQL', icon: 'postgres', group: 'Banco de Dados (Relacional)', aliases: ['postgres', 'postgresql'] },
  { label: 'MySQL', icon: 'mysql', group: 'Banco de Dados (Relacional)', aliases: ['mysql'] },
  { label: 'MongoDB', icon: 'mongodb', group: 'Banco de Dados (Não Relacional)', aliases: ['mongodb', 'mongo'] },
  { label: 'Firebase', icon: 'firebase', group: 'Banco de Dados (Não Relacional)', aliases: ['firebase'] },
  { label: 'Supabase', icon: 'supabase', group: 'Banco de Dados (Não Relacional)', aliases: ['supabase'] },
  { label: 'Flutter', icon: 'flutter', group: 'Mobile', aliases: ['flutter'] },
  { label: 'Dart', icon: 'dart', group: 'Mobile', aliases: ['dart'] },
  { label: 'Swift', icon: 'swift', group: 'Mobile', aliases: ['swift'] },
  { label: 'Git', icon: 'git', group: 'Ferramentas', aliases: ['git'] },
  { label: 'GitHub API', icon: 'github', group: 'Ferramentas', aliases: ['github api', 'github rest api'] },
  { label: 'Vite', icon: 'vite', group: 'Ferramentas', aliases: ['vite'] },
  { label: 'Pinia', icon: 'pinia', group: 'Ferramentas', aliases: ['pinia'] },
  { label: 'Jupyter Notebook', icon: 'python', group: 'Ferramentas', aliases: ['jupyter notebook', 'jupyter'] },
  { label: 'Postman', icon: 'postman', group: 'Ferramentas', aliases: ['postman'] },
  { label: 'WordPress', icon: 'wordpress', group: 'Ferramentas', aliases: ['wordpress'] },
  { label: 'Android Studio', icon: 'androidstudio', group: 'Ferramentas', aliases: ['androidstudio', 'android studio'] },
  { label: 'OpenCV', icon: 'opencv', group: 'Outros', aliases: ['opencv'] },
  { label: 'Arduino', icon: 'arduino', group: 'Outros', aliases: ['arduino'] },
  { label: 'Raspberry Pi', icon: 'raspberrypi', group: 'Outros', aliases: ['raspberrypi', 'raspberry pi'] },
  { label: 'Blender', icon: 'blender', group: 'Outros', aliases: ['blender'] },
  { label: 'Unreal Engine', icon: 'unrealengine', group: 'Outros', aliases: ['unrealengine', 'unreal engine'] },
] as const

const stackAliasMap = new Map(
  knownStacks.flatMap((stack) =>
    stack.aliases.map((alias) => [alias.toLowerCase(), stack] as const),
  ),
)

const stackGroupOrder = [
  'Front-end',
  'Back-end',
  'Estilização',
  'Banco de Dados (Relacional)',
  'Banco de Dados (Não Relacional)',
  'Mobile',
  'Ferramentas',
  'Outros',
]

function addStack(target: Map<string, GitHubStackItem & { group: string }>, value: string) {
  const normalizedValue = value.toLowerCase().trim()
  const stack = stackAliasMap.get(normalizedValue)
  const fallbackLabel = formatProjectName(value)
  const fallbackIcon = slugifyProjectPath(value)

  if (stack && target.has(stack.label)) {
    return
  }

  if (!stack && target.has(fallbackLabel)) {
    return
  }

  target.set(stack?.label ?? fallbackLabel, {
    label: stack?.label ?? fallbackLabel,
    icon: stack?.icon ?? fallbackIcon,
    group: stack?.group ?? 'Outros',
  })
}

function extractStackIconsFromReadme(readme: string) {
  const icons = [...readme.matchAll(/skillicons\.dev\/icons\?i=([^)"'\s&]+)/gi)]

  return icons.flatMap((match) =>
    decodeURIComponent(match[1])
      .split(',')
      .map((icon) => icon.trim())
      .filter(Boolean),
  )
}

function extractStacksFromText(readme: string) {
  const foundStacks = new Map<string, GitHubStackItem & { group: string }>()

  for (const icon of extractStackIconsFromReadme(readme)) {
    addStack(foundStacks, icon)
  }

  const searchableText = cleanMarkdownText(readme).toLowerCase()

  for (const stack of knownStacks) {
    if (stack.aliases.some((alias) => new RegExp(`(^|[^a-z0-9.])${escapeRegExp(alias)}([^a-z0-9.]|$)`, 'i').test(searchableText))) {
      addStack(foundStacks, stack.aliases[0])
    }
  }

  return [...foundStacks.values()]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function groupStacks(stacks: Array<GitHubStackItem & { group: string }>) {
  return stackGroupOrder
    .map((title) => ({
      title,
      items: stacks
        .filter((stack) => stack.group === title)
        .map(({ label, icon }) => ({ label, icon })),
    }))
    .filter((group) => group.items.length)
}

async function fetchRepoLanguages(repo: GitHubRepo) {
  return githubFetch<GitHubRepoLanguagesApiResponse>(
    `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
  )
}

export async function fetchGitHubStackSummary(forceRefresh = false): Promise<GitHubStackSummary> {
  const cachedSummary = !forceRefresh
    ? readCache<GitHubStackSummary>(STACK_SUMMARY_CACHE_KEY, STACK_SUMMARY_CACHE_TTL)
    : null

  if (cachedSummary) {
    return cachedSummary
  }

  const repos = await fetchGitHubRepos(forceRefresh)
  const recentStacks = new Map<string, GitHubStackItem & { group: string }>()
  const studiedStacks = new Map<string, GitHubStackItem & { group: string }>()
  const recentlyUpdatedRepos = [...repos].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  for (const repo of recentlyUpdatedRepos) {
    if (repo.language) {
      addStack(studiedStacks, repo.language)
    }
  }

  for (const repo of recentlyUpdatedRepos.slice(0, 8)) {
    if (repo.language) {
      addStack(recentStacks, repo.language)
    }
  }

  const readmeResults = await Promise.allSettled(
    recentlyUpdatedRepos.map(async (repo) => ({
      repo,
      readme: await fetchGitHubReadme(repo.name, forceRefresh),
    })),
  )

  const languageResults = await Promise.allSettled(
    recentlyUpdatedRepos.map(async (repo) => ({
      repo,
      languages: await fetchRepoLanguages(repo),
    })),
  )

  for (const result of languageResults) {
    if (result.status !== 'fulfilled') {
      continue
    }

    for (const language of Object.keys(result.value.languages)) {
      addStack(studiedStacks, language)
    }
  }

  for (const result of languageResults.slice(0, 8)) {
    if (result.status !== 'fulfilled') {
      continue
    }

    for (const language of Object.keys(result.value.languages)) {
      if (recentStacks.size >= 8) {
        break
      }

      addStack(recentStacks, language)
    }
  }

  for (const result of readmeResults) {
    if (result.status !== 'fulfilled') {
      continue
    }

    const stacks = extractStacksFromText(result.value.readme)

    for (const stack of stacks) {
      studiedStacks.set(stack.label, stack)
    }
  }

  for (const result of readmeResults.slice(0, 8)) {
    if (result.status !== 'fulfilled') {
      continue
    }

    for (const stack of extractStacksFromText(result.value.readme)) {
      if (recentStacks.size >= 8) {
        break
      }

      recentStacks.set(stack.label, stack)
    }
  }

  const summary = {
    recent: [...recentStacks.values()].slice(0, 8).map(({ label, icon }) => ({ label, icon })),
    studiedGroups: groupStacks([...studiedStacks.values()]),
  }

  writeCache(STACK_SUMMARY_CACHE_KEY, summary)

  return summary
}

export function formatGitHubDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
