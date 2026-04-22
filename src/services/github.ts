import type { StackItem } from '../data/profile'

const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'GilvanPOliveira'
const REPOS_CACHE_KEY = `portfolio:github:repos:${GITHUB_USERNAME}`
const README_CACHE_PREFIX = `portfolio:github:readme:${GITHUB_USERNAME}:`
const REPOS_CACHE_TTL = 1000 * 60 * 30
const README_CACHE_TTL = 1000 * 60 * 60 * 6

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
  updatedAt: string
  htmlUrl: string
  homepage: string
}

type GitHubRepoApiResponse = {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
  homepage: string | null
  fork: boolean
  archived: boolean
}

const memoryCache = new Map<string, CacheEntry<unknown>>()

const GITHUB_LANGUAGE_ICON_MAP: Record<string, StackItem> = {
  JavaScript: { label: 'JavaScript', icon: 'js' },
  TypeScript: { label: 'TypeScript', icon: 'ts' },
  Python: { label: 'Python', icon: 'python' },
  Java: { label: 'Java', icon: 'java' },
  PHP: { label: 'PHP', icon: 'php' },
  HTML: { label: 'HTML5', icon: 'html' },
  CSS: { label: 'CSS', icon: 'css' },
  SCSS: { label: 'Sass', icon: 'sass' },
  Sass: { label: 'Sass', icon: 'sass' },
  Vue: { label: 'Vue', icon: 'vue' },
  'Vue.js': { label: 'Vue', icon: 'vue' },
  React: { label: 'React', icon: 'react' },
  Angular: { label: 'Angular', icon: 'angular' },
  Dart: { label: 'Dart', icon: 'dart' },
  Swift: { label: 'Swift', icon: 'swift' },
  Kotlin: { label: 'Kotlin', icon: 'kotlin' },
  'C#': { label: 'C#', icon: 'cs' },
  C: { label: 'C', icon: 'c' },
  'C++': { label: 'C++', icon: 'cpp' },
  Go: { label: 'Go', icon: 'go' },
  Rust: { label: 'Rust', icon: 'rust' },
  Shell: { label: 'Shell', icon: 'bash' },
  Dockerfile: { label: 'Docker', icon: 'docker' },
  SQL: { label: 'SQL', icon: 'postgres' },
  PLpgSQL: { label: 'PostgreSQL', icon: 'postgres' },
}

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
    // Ignora falhas de escrita em ambientes com storage indisponível.
  }
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
    updatedAt: repo.updated_at,
    htmlUrl: repo.html_url,
    homepage: repo.homepage?.trim() || '',
  }
}

function mapLanguageToStack(language: string): StackItem | null {
  return GITHUB_LANGUAGE_ICON_MAP[language.trim()] || null
}

export async function fetchGitHubRepos(forceRefresh = false): Promise<GitHubRepo[]> {
  const cachedRepos = !forceRefresh ? readCache<GitHubRepo[]>(REPOS_CACHE_KEY, REPOS_CACHE_TTL) : null

  if (cachedRepos) {
    return cachedRepos
  }

  const repos = await githubFetch<GitHubRepoApiResponse[]>(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
  )

  const normalizedRepos = repos
    .filter((repo) => !repo.fork && !repo.archived && !repo.name.endsWith('.github.io'))
    .map(normalizeRepo)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  writeCache(REPOS_CACHE_KEY, normalizedRepos)

  return normalizedRepos
}

export async function fetchGitHubTopStacks(limit = 7): Promise<StackItem[]> {
  const repos = await fetchGitHubRepos()
  const languageFrequency = new Map<string, number>()

  repos.forEach((repo) => {
    if (!repo.language) {
      return
    }

    const mappedStack = mapLanguageToStack(repo.language)

    if (!mappedStack) {
      return
    }

    const currentCount = languageFrequency.get(repo.language) || 0
    languageFrequency.set(repo.language, currentCount + 1)
  })

  return [...languageFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([language]) => mapLanguageToStack(language))
    .filter((item): item is StackItem => Boolean(item))
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
