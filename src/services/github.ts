const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'GilvanPOliveira'
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

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
  isPinned: boolean
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
  pinned?: boolean
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  }

  return headers
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

      throw new Error(
        'GitHub retornou 403. Verifique se o token é válido, se não expirou e se está configurado corretamente no arquivo .env.',
      )
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
    isPinned: Boolean(repo.pinned),
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const repos = await githubFetch<GitHubRepoApiResponse[]>(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
  )

  return repos
    .filter((repo) => !repo.name.endsWith('.github.io'))
    .map(normalizeRepo)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
}

export async function fetchGitHubReadme(repoName: string): Promise<string> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/readme`,
    {
      headers: {
        ...buildHeaders(),
        Accept: 'application/vnd.github.raw+json',
      },
    },
  )

  if (!response.ok) {
    if (response.status === 404) {
      return 'README não encontrado para este repositório.'
    }

    if (response.status === 403) {
      throw new Error(
        'GitHub bloqueou temporariamente a leitura do README. Verifique o token configurado no .env.',
      )
    }

    throw new Error(`Erro ao carregar README: ${response.status}`)
  }

  return response.text()
}

export function formatGitHubDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
