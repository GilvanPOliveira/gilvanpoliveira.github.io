<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import MatrixShell from '../components/MatrixShell.vue'
import { useGitHubPortfolio } from '../composables/useGitHubPortfolio'
import { routeSeo } from '../data/site'
import { formatGitHubDate, type GitHubRepo } from '../services/github'
import { applySeo } from '../utils/seo'

const route = useRoute()
const router = useRouter()

const {
  repos,
  readme,
  loadingRepos,
  loadingReadme,
  reposError,
  readmeError,
  loadRepos,
  loadReadme,
} = useGitHubPortfolio()

const currentPage = ref(1)
const perPage = ref(3)

const selectedSlug = computed(() => String(route.query.repo ?? ''))

const selectedRepo = computed(() => {
  if (!repos.value.length) {
    return null
  }

  return repos.value.find((repo) => repo.slug === selectedSlug.value) ?? repos.value[0]
})

const totalPages = computed(() => Math.max(1, Math.ceil(repos.value.length / perPage.value)))

const paginatedRepos = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return repos.value.slice(start, start + perPage.value)
})

const detailRoute = computed(() =>
  selectedRepo.value ? `/projetos/${encodeURIComponent(selectedRepo.value.slug)}` : '/projetos',
)

function updatePerPage() {
  const width = window.innerWidth
  perPage.value = width >= 640 && width < 1280 ? 4 : 3
}

function syncPageWithSelectedRepo() {
  if (!selectedRepo.value || !repos.value.length) {
    return
  }

  const index = repos.value.findIndex((repo) => repo.id === selectedRepo.value?.id)

  if (index >= 0) {
    currentPage.value = Math.floor(index / perPage.value) + 1
  }
}

function clampCurrentPage() {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  if (currentPage.value < 1) {
    currentPage.value = 1
  }
}

function replaceRouteWithCurrentState() {
  const start = (currentPage.value - 1) * perPage.value
  const firstRepoOnPage = repos.value[start]

  router.replace({
    path: '/projetos',
    query: {
      repo: selectedRepo.value?.slug ?? firstRepoOnPage?.slug ?? '',
      page: String(currentPage.value),
    },
  })
}

function handleResize() {
  const previousPerPage = perPage.value
  updatePerPage()

  if (previousPerPage !== perPage.value) {
    if (selectedRepo.value) {
      syncPageWithSelectedRepo()
    } else {
      clampCurrentPage()
    }

    replaceRouteWithCurrentState()
  }
}

function selectRepo(repo: GitHubRepo) {
  const index = repos.value.findIndex((item) => item.id === repo.id)
  const page = Math.floor(index / perPage.value) + 1

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

  const start = (nextPage - 1) * perPage.value
  const firstRepoOnPage = repos.value[start]

  router.replace({
    path: '/projetos',
    query: {
      repo: firstRepoOnPage?.slug ?? selectedRepo.value?.slug ?? '',
      page: String(nextPage),
    },
  })
}

watch(
  () => route.query.page,
  (value) => {
    const parsed = Number(value)
    currentPage.value = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
    clampCurrentPage()
  },
  { immediate: true },
)

watch(
  selectedRepo,
  (repo) => {
    if (!repo) {
      applySeo({
        title: routeSeo.projects.title,
        description: routeSeo.projects.description,
        path: '/projetos',
      })
      return
    }

    void loadReadme(repo.name)
    syncPageWithSelectedRepo()
    applySeo({
      title: `${repo.name} | Projetos | Gilvan Oliveira`,
      description: repo.description,
      path: '/projetos',
    })
  },
  { immediate: true },
)

watch(perPage, () => {
  clampCurrentPage()
})

onMounted(async () => {
  updatePerPage()
  window.addEventListener('resize', handleResize)
  await loadRepos()

  if (!repos.value.length) {
    return
  }

  const hasSelectedRepo = repos.value.some((repo) => repo.slug === selectedSlug.value)

  if (!selectedSlug.value || !hasSelectedRepo) {
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
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
        :aria-busy="loadingRepos || loadingReadme"
      >
        <div
          v-if="loadingRepos"
          class="flex min-h-[320px] items-center justify-center text-center text-sm text-slate-400 xl:h-full"
          role="status"
          aria-live="polite"
        >
          Carregando projetos do GitHub...
        </div>

        <div
          v-else-if="reposError"
          class="flex min-h-[320px] items-center justify-center text-center text-sm text-rose-300 xl:h-full"
          role="status"
          aria-live="polite"
        >
          {{ reposError }}
        </div>

        <div v-else-if="selectedRepo" class="flex h-full min-h-0 flex-col">
          <p class="text-[10px] uppercase tracking-[0.28em] text-cyan-300/80 sm:text-xs">
            Projetos em destaque
          </p>

          <h1 class="mt-3 text-2xl font-semibold text-white sm:text-3xl">Projetos</h1>

          <h2 class="mt-3 break-words text-xl font-semibold text-slate-100 sm:text-2xl lg:text-3xl">
            {{ selectedRepo.name }}
          </h2>

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
              Ver detalhes
            </RouterLink>

            <a
              v-if="selectedRepo.homepage"
              :href="selectedRepo.homepage"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-white transition hover:bg-emerald-400/20 sm:w-auto"
              :aria-label="`Abrir deploy do projeto ${selectedRepo.name}`"
            >
              Ver deploy
            </a>

            <a
              :href="selectedRepo.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:w-auto"
              :aria-label="`Abrir repositório ${selectedRepo.name} no GitHub`"
            >
              Repositório no GitHub
            </a>
          </div>

          <div class="mt-6 sm:hidden">
            <RouterLink
              :to="detailRoute"
              class="inline-flex w-full items-center justify-center rounded-[18px] border border-violet-400/30 bg-violet-400/10 px-4 py-3 text-sm text-white transition hover:bg-violet-400/20"
            >
              Ver README completo
            </RouterLink>
          </div>

          <div class="mt-5 hidden min-h-0 flex-1 pb-8 sm:block">
            <p class="mb-4 text-[10px] uppercase tracking-[0.28em] text-violet-300/80 sm:text-xs">
              README
            </p>

            <div
              class="h-[320px] overflow-y-auto rounded-[18px] border border-white/10 bg-slate-950/80 p-4 sm:h-[360px] lg:h-[420px] xl:h-full xl:min-h-0"
              aria-live="polite"
            >
              <div v-if="loadingReadme" class="text-sm text-slate-400" role="status">
                Carregando README...
              </div>

              <div v-else-if="readmeError" class="text-sm text-rose-300" role="status">
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
        <section
          aria-labelledby="outros-repos-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[560px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="outros-repos-title"
              class="text-center text-[10px] uppercase tracking-[0.28em] text-emerald-300/80 sm:text-xs"
            >
              Outros repositórios
            </h2>

            <div class="mt-5 flex h-full flex-col xl:min-h-0">
              <div
                class="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:min-h-0 xl:flex-col xl:overflow-y-auto xl:pr-1"
              >
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
                  :aria-pressed="selectedRepo?.id === repo.id"
                >
                  <p class="text-sm font-medium text-white">{{ repo.name }}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-400">
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
                  aria-label="Ir para a página anterior de repositórios"
                >
                  Anterior
                </button>

                <span class="text-xs text-slate-300">{{ currentPage }} / {{ totalPages }}</span>

                <button
                  type="button"
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Ir para a próxima página de repositórios"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </MatrixShell>
</template>
