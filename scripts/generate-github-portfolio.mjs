import { readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const outputPath = resolve(rootDir, 'public/github-portfolio.json')

loadDotEnv(resolve(rootDir, '.env'))

const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME =
  process.env.GITHUB_USERNAME || process.env.VITE_GITHUB_USERNAME || 'GilvanPOliveira'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

if (!GITHUB_TOKEN) {
  console.warn('[github-portfolio] GITHUB_TOKEN ausente. O JSON estatico nao sera gerado.')
  process.exit(0)
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
}

const deployDomains = [
  'github.io',
  'vercel.app',
  'netlify.app',
  'render.com',
  'onrender.com',
  'firebaseapp.com',
  'web.app',
  'surge.sh',
]

function loadDotEnv(path) {
  try {
    const raw = readFileSync(path, 'utf8')

    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .forEach((line) => {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')

        if (!process.env[key]) {
          process.env[key] = value
        }
      })
  } catch {
  }
}

function normalizeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    slug: repo.name.toLowerCase(),
    description: repo.description?.trim() || 'Sem descricao cadastrada.',
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

function formatProjectName(value) {
  return decodeURIComponent(value)
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function slugifyProjectPath(path) {
  return path
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanMarkdownText(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitle(readme, fallback) {
  const heading = readme
    .split('\n')
    .map((line) => line.trim())
    .find((line) => /^#{1,2}\s+\S/.test(line))

  return heading ? cleanMarkdownText(heading.replace(/^#{1,2}\s+/, '')) : formatProjectName(fallback)
}

function extractDescription(readme) {
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

  return 'Projeto publicado com deploy disponivel.'
}

function normalizeUrl(url) {
  return url.replace(/[),.;\]]+$/g, '').trim()
}

function isDeployUrl(url) {
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

    return deployDomains.some(
      (domain) => normalizedHost === domain || normalizedHost.endsWith(`.${domain}`),
    )
  } catch {
    return false
  }
}

function extractDeployUrl(readme) {
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

  return (
    [...readme.matchAll(/\bhttps?:\/\/[^\s<>)]+/gi)]
      .map((match) => normalizeUrl(match[0]))
      .find(isDeployUrl) || ''
  )
}

async function githubFetch(input) {
  const response = await fetchWithRetry(input, { headers })

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`)
  }

  return response.json()
}

async function fetchWithRetry(input, init, retries = 3) {
  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(input, init)

      if (response.status !== 429 && response.status !== 502 && response.status !== 503) {
        return response
      }

      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }

    await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)))
  }

  throw lastError instanceof Error ? lastError : new Error('fetch failed')
}

async function fetchRawFile(repoName, path, branch) {
  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  const response = await fetchWithRetry(
    `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}/contents/${encodedPath}?ref=${encodeURIComponent(
      branch,
    )}`,
    {
      headers: {
        ...headers,
        Accept: 'application/vnd.github.raw+json',
      },
    },
  )

  if (!response.ok) {
    return ''
  }

  return response.text()
}

async function fetchRepos() {
  const repos = await githubFetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=created`,
  )

  return repos
    .filter((repo) => !repo.fork && !repo.archived && !repo.name.endsWith('.github.io'))
    .map(normalizeRepo)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function fetchRepoReadme(repo) {
  const readme = await fetchRawFile(repo.name, 'README.md', repo.defaultBranch)
  return readme || 'README nao encontrado para este repositorio.'
}

async function fetchRepoProjects(repo) {
  const tree = await githubFetch(
    `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/git/trees/${encodeURIComponent(
      repo.defaultBranch,
    )}?recursive=1`,
  )

  if (tree.truncated) {
    return []
  }

  const readmePaths = tree.tree
    .filter((item) => item.type === 'blob' && /(^|\/)readme\.md$/i.test(item.path))
    .filter((item) => item.path.includes('/'))
    .filter((item) => !isDependencyPath(item.path))
    .map((item) => item.path)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const projects = []

  for (const readmePath of readmePaths) {
    const readme = await fetchRawFile(repo.name, readmePath, repo.defaultBranch)
    const deployUrl = extractDeployUrl(readme)

    if (!readme || !deployUrl) {
      continue
    }

    const projectPath = readmePath.replace(/\/readme\.md$/i, '')
    const fallbackName = projectPath.split('/').at(-1) || projectPath

    projects.push({
      id: `${repo.id}:${projectPath}`,
      name: extractTitle(readme, fallbackName),
      slug: slugifyProjectPath(projectPath),
      path: projectPath,
      description: extractDescription(readme),
      deployUrl,
      htmlUrl: `${repo.htmlUrl}/tree/${encodeURIComponent(repo.defaultBranch)}/${projectPath
        .split('/')
        .map((part) => encodeURIComponent(part))
        .join('/')}`,
      readme,
    })
  }

  return filterLeafProjects(projects)
}

function isDependencyPath(path) {
  return path
    .split('/')
    .map((part) => part.toLowerCase())
    .some((part) => ['node_modules', 'vendor', '.venv', 'venv'].includes(part))
}

function filterLeafProjects(projects) {
  return projects.filter(
    (project) => !projects.some((candidate) => candidate.path.startsWith(`${project.path}/`)),
  )
}

async function main() {
  const repos = await fetchRepos()
  const readmesByRepo = {}
  const repoProjectsByRepo = {}

  for (const repo of repos) {
    try {
      readmesByRepo[repo.name.toLowerCase()] = await fetchRepoReadme(repo)
      repoProjectsByRepo[repo.name.toLowerCase()] = await fetchRepoProjects(repo)
      console.log(
        `[github-portfolio] ${repo.name}: ${repoProjectsByRepo[repo.name.toLowerCase()].length} projetos com deploy`,
      )
    } catch (error) {
      readmesByRepo[repo.name.toLowerCase()] = repo.description
      repoProjectsByRepo[repo.name.toLowerCase()] = []
      console.warn(
        `[github-portfolio] ${repo.name}: falha ao gerar dados (${error instanceof Error ? error.message : String(
          error,
        )})`,
      )
    }
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        username: GITHUB_USERNAME,
        repos,
        readmesByRepo,
        repoProjectsByRepo,
      },
      null,
      2,
    )}\n`,
  )

  console.log(`[github-portfolio] Dados gerados em ${outputPath}`)
}

main().catch((error) => {
  console.error(`[github-portfolio] ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
