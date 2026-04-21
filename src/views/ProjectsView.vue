<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import MatrixShell from '../components/MatrixShell.vue'
import {
  fetchGitHubReadme,
  fetchGitHubRepos,
  formatGitHubDate,
  type GitHubRepo,
} from '../services/github'

const route = useRoute()
const router = useRouter()

const repos = ref<GitHubRepo[]>([])
const readme = ref('')
const loadingRepos = ref(true)
const loadingReadme = ref(false)
const reposError = ref('')
const readmeError = ref('')
const currentPage = ref(1)

const PER_PAGE = 3

const selectedSlug = computed(() => String(route.query.repo ?? ''))

const selectedRepo = computed(() => {
  if (!repos.value.length) return null
  return repos.value.find((repo) => repo.slug === selectedSlug.value) ?? repos.value[0]
})

const totalPages = computed(() => Math.max(1, Math.ceil(repos.value.length / PER_PAGE)))

const paginatedRepos = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return repos.value.slice(start, start + PER_PAGE)
})

const detailRoute = computed(() =>
  selectedRepo.value ? `/projetos/${encodeURIComponent(selectedRepo.value.slug)}` : '/projetos',
)

function syncPageWithSelectedRepo() {
  if (!selectedRepo.value || !repos.value.length) return

  const index = repos.value.findIndex((repo) => repo.id === selectedRepo.value?.id)

  if (index >= 0) {
    currentPage.value = Math.floor(index / PER_PAGE) + 1
  }
}

function selectRepo(repo: GitHubRepo) {
  const index = repos.value.findIndex((item) => item.id === repo.id)
  const page = Math.floor(index / PER_PAGE) + 1

  router.replace({
    path: '/projetos',
    query: {
      repo: repo.slug,
      page: String(page),
    },
  })
}

function goToPage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value)
  currentPage.value = nextPage

  const start = (nextPage - 1) * PER_PAGE
  const firstRepoOnPage = repos.value[start]

  router.replace({
    path: '/projetos',
    query: {
      repo: firstRepoOnPage?.slug ?? selectedRepo.value?.slug ?? '',
      page: String(nextPage),
    },
  })
}

async function loadRepos() {
  loadingRepos.value = true
  reposError.value = ''

  try {
    repos.value = await fetchGitHubRepos()

    if (!selectedSlug.value && repos.value[0]) {
      router.replace({
        path: '/projetos',
        query: {
          repo: repos.value[0].slug,
          page: '1',
        },
      })
      return
    }

    syncPageWithSelectedRepo()
  } catch (error) {
    reposError.value = error instanceof Error ? error.message : 'Erro ao carregar os repositórios.'
  } finally {
    loadingRepos.value = false
  }
}

async function loadReadme(repoName: string) {
  loadingReadme.value = true
  readmeError.value = ''
  readme.value = ''

  try {
    readme.value = await fetchGitHubReadme(repoName)
  } catch (error) {
    readmeError.value = error instanceof Error ? error.message : 'Erro ao carregar o README.'
  } finally {
    loadingReadme.value = false
  }
}

watch(
  () => route.query.page,
  (value) => {
    const parsed = Number(value)
    currentPage.value = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  },
  { immediate: true },
)

watch(
  selectedRepo,
  (repo) => {
    if (repo) {
      loadReadme(repo.name)
      syncPageWithSelectedRepo()
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadRepos()
})
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5 lg:p-6 2xl:h-[560px] 2xl:overflow-hidden"
      >
        <div
          v-if="loadingRepos"
          class="flex min-h-[320px] items-center justify-center text-sm text-slate-400 2xl:h-full"
        >
          Carregando repositórios...
        </div>

        <div
          v-else-if="reposError"
          class="flex min-h-[320px] items-center justify-center text-center text-sm text-rose-300 2xl:h-full"
        >
          {{ reposError }}
        </div>

        <div
          v-else-if="selectedRepo"
          class="flex h-full flex-col"
        >
          <p class="text-[10px] uppercase tracking-[0.28em] text-cyan-300/80 sm:text-xs">
            {{ selectedRepo.isPinned ? 'Pinado' : 'Repositório em destaque' }}
          </p>

          <h1 class="mt-3 break-words text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
            {{ selectedRepo.name }}
          </h1>

          <p class="mt-4 text-sm leading-7 text-slate-300">
            {{ selectedRepo.description }}
          </p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-if="selectedRepo.language"
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              {{ selectedRepo.language }}
            </span>

            <span
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              ★ {{ selectedRepo.stargazersCount }}
            </span>

            <span
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              Forks {{ selectedRepo.forksCount }}
            </span>

            <span
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              Atualizado em {{ formatGitHubDate(selectedRepo.updatedAt) }}
            </span>
          </div>

          <div class="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            <RouterLink
              :to="detailRoute"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm text-white transition hover:bg-cyan-400/20 sm:w-auto"
            >
              Ver página do projeto
            </RouterLink>

            <a
              :href="selectedRepo.htmlUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:w-auto"
            >
              Repositório no GitHub
            </a>
          </div>

          <div class="mt-6 min-[500px]:hidden">
            <RouterLink
              :to="detailRoute"
              class="inline-flex w-full items-center justify-center rounded-[18px] border border-violet-400/30 bg-violet-400/10 px-4 py-3 text-sm text-white transition hover:bg-violet-400/20"
            >
              Ver README completo
            </RouterLink>
          </div>

          <div class="mt-6 hidden min-[500px]:block min-h-0 flex-1">
            <p class="mb-4 text-[10px] uppercase tracking-[0.28em] text-violet-300/80 sm:text-xs">
              README
            </p>

            <div
              class="overflow-y-auto rounded-[18px] border border-white/10 bg-slate-950/80 p-4 h-[40vh] min-h-[240px] max-h-[520px] sm:h-[44vh] lg:h-[50vh] 2xl:h-full 2xl:min-h-0 2xl:max-h-none"
            >
              <div
                v-if="loadingReadme"
                class="text-sm text-slate-400"
              >
                Carregando README...
              </div>

              <div
                v-else-if="readmeError"
                class="text-sm text-rose-300"
              >
                {{ readmeError }}
              </div>

              <pre
                v-else
                class="whitespace-pre-wrap break-words text-xs leading-6 text-slate-200 sm:text-sm sm:leading-7"
              >{{ readme }}</pre>
            </div>
          </div>
        </div>
      </article>

      <aside class="grid gap-6">
        <div
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-4 sm:p-5 2xl:h-[560px] 2xl:overflow-hidden"
        >
          <p class="text-center text-[10px] uppercase tracking-[0.28em] text-emerald-300/80 sm:text-xs">
            Demais repositórios
          </p>

          <div class="mt-5 flex h-full flex-col 2xl:h-[calc(100%-2.25rem)]">
            <div class="grid gap-3 sm:grid-cols-2 2xl:flex 2xl:flex-1 2xl:flex-col 2xl:overflow-y-auto 2xl:pr-1">
              <button
                v-for="repo in paginatedRepos"
                :key="repo.id"
                type="button"
                @click="selectRepo(repo)"
                class="block w-full rounded-2xl border px-4 py-3 text-left transition"
                :class="
                  selectedRepo?.id === repo.id
                    ? 'border-cyan-400/40 bg-cyan-400/10'
                    : 'border-white/10 bg-black/20 hover:border-violet-400/30 hover:bg-violet-400/10'
                "
              >
                <p class="text-sm font-medium text-white">{{ repo.name }}</p>
                <p class="mt-1 line-clamp-3 text-xs leading-5 text-slate-400">
                  {{ repo.description }}
                </p>
              </button>
            </div>

            <div class="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <span class="text-xs text-slate-300">
                {{ currentPage }} / {{ totalPages }}
              </span>

              <button
                type="button"
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </MatrixShell>
</template>
