import { ref } from 'vue'
import { fetchGitHubReadme, fetchGitHubRepos, type GitHubRepo } from '../services/github'

export function useGitHubPortfolio() {
  const repos = ref<GitHubRepo[]>([])
  const readme = ref('')
  const loadingRepos = ref(false)
  const loadingReadme = ref(false)
  const reposError = ref('')
  const readmeError = ref('')

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

  return {
    repos,
    readme,
    loadingRepos,
    loadingReadme,
    reposError,
    readmeError,
    loadRepos,
    loadReadme,
  }
}
