import { ref } from 'vue'
import {
  fetchGitHubReadme,
  fetchGitHubRepoProjects,
  fetchGitHubRepos,
  type GitHubRepo,
  type GitHubRepoProject,
} from '../services/github'

export function useGitHubPortfolio() {
  const repos = ref<GitHubRepo[]>([])
  const repoProjects = ref<GitHubRepoProject[]>([])
  const readme = ref('')
  const loadingRepos = ref(false)
  const loadingRepoProjects = ref(false)
  const loadingReadme = ref(false)
  const reposError = ref('')
  const repoProjectsError = ref('')
  const readmeError = ref('')
  let repoProjectsRequestId = 0

  async function loadRepos() {
    loadingRepos.value = true
    reposError.value = ''

    try {
      repos.value = await fetchGitHubRepos()
    } catch (error) {
      reposError.value = error instanceof Error ? error.message : 'Erro ao carregar os repositórios.'
    } finally {
      loadingRepos.value = false
    }
  }

  async function loadReadme(repoName?: string | null) {
    loadingReadme.value = true
    readmeError.value = ''
    readme.value = ''

    if (!repoName) {
      loadingReadme.value = false
      return
    }

    try {
      readme.value = await fetchGitHubReadme(repoName)
    } catch (error) {
      readmeError.value = error instanceof Error ? error.message : 'Erro ao carregar o README.'
    } finally {
      loadingReadme.value = false
    }
  }

  async function loadRepoProjects(repo?: GitHubRepo | null) {
    const requestId = ++repoProjectsRequestId

    loadingRepoProjects.value = true
    repoProjectsError.value = ''
    repoProjects.value = []

    if (!repo) {
      loadingRepoProjects.value = false
      return
    }

    try {
      const projects = await fetchGitHubRepoProjects(repo)

      if (requestId === repoProjectsRequestId) {
        repoProjects.value = projects
      }
    } catch (error) {
      if (requestId === repoProjectsRequestId) {
        repoProjectsError.value =
          error instanceof Error ? error.message : 'Erro ao carregar os projetos deste repositório.'
      }
    } finally {
      if (requestId === repoProjectsRequestId) {
        loadingRepoProjects.value = false
      }
    }
  }

  return {
    repos,
    repoProjects,
    readme,
    loadingRepos,
    loadingRepoProjects,
    loadingReadme,
    reposError,
    repoProjectsError,
    readmeError,
    loadRepos,
    loadRepoProjects,
    loadReadme,
  }
}
