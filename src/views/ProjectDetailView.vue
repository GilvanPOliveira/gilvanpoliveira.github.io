<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import MatrixShell from '../components/MatrixShell.vue'
import { useGitHubPortfolio } from '../composables/useGitHubPortfolio'
import { routeSeo } from '../data/site'
import { formatGitHubDate } from '../services/github'
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

const PER_PAGE = 3

const slug = computed(() => String(route.params.slug ?? ''))

const repo = computed(() => repos.value.find((item) => item.slug === slug.value) ?? null)

const totalPages = computed(() => Math.max(1, Math.ceil(repos.value.length / PER_PAGE)))

const paginatedRepos = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return repos.value.slice(start, start + PER_PAGE)
})

const currentRepoIndex = computed(() => {
  if (!repo.value) {
    return -1
  }

  return repos.value.findIndex((item) => item.slug === repo.value?.slug)
})

const previousRepo = computed(() => {
  if (currentRepoIndex.value <= 0) {
    return null
  }

  return repos.value[currentRepoIndex.value - 1] ?? null
})

const nextRepo = computed(() => {
  if (currentRepoIndex.value < 0 || currentRepoIndex.value >= repos.value.length - 1) {
    return null
  }

  return repos.value[currentRepoIndex.value + 1] ?? null
})

function syncCurrentPage() {
  if (!repo.value) {
    return
  }

  currentPage.value = Math.floor(currentRepoIndex.value / PER_PAGE) + 1
}

function goToPage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value)
  currentPage.value = nextPage
}

function redirectToNotFound() {
  const pathMatch = route.path.replace(/^\/+/, '').split('/').filter(Boolean)

  router.replace({
    name: 'not-found',
    params: {
      pathMatch,
    },
  })
}

watch(
  repo,
  (currentRepo) => {
    if (!currentRepo) {
      if (!loadingRepos.value && repos.value.length) {
        redirectToNotFound()
      }

      applySeo({
        title: routeSeo.projectDetail.title,
        description: routeSeo.projectDetail.description,
        path: '/projetos',
      })
      return
    }

    syncCurrentPage()
    void loadReadme(currentRepo.name)
    applySeo({
      title: `${currentRepo.name} | Projetos | Gilvan Oliveira`,
      description: currentRepo.description,
      path: `/projetos/${encodeURIComponent(currentRepo.slug)}`,
    })
  },
  { immediate: true },
)

watch(
  [repos, loadingRepos],
  ([currentRepos, isLoading]) => {
    if (!isLoading && currentRepos.length && !repo.value) {
      redirectToNotFound()
    }
  },
  { deep: true },
)

watch(
  () => route.params.slug,
  () => {
    syncCurrentPage()
  },
)

onMounted(async () => {
  await loadRepos()

  if (!repos.value.length) {
    return
  }

  if (!repo.value) {
    redirectToNotFound()
    return
  }

  syncCurrentPage()
})
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
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
          Carregando repositório...
        </div>

        <div
          v-else-if="reposError"
          class="flex min-h-[320px] items-center justify-center text-center text-sm text-rose-300 xl:h-full"
          role="status"
          aria-live="polite"
        >
          {{ reposError }}
        </div>

        <div v-else-if="repo" class="flex h-full min-h-0 flex-col">
          <p class="text-[10px] uppercase tracking-[0.28em] text-cyan-300/80 sm:text-xs">
            Projeto
          </p>

          <h1 class="mt-3 break-words text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {{ repo.name }}
          </h1>

          <p class="mt-4 text-sm leading-7 text-slate-300">
            {{ repo.description }}
          </p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-if="repo.language"
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              {{ repo.language }}
            </span>

            <span
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              ★ {{ repo.stargazersCount }}
            </span>

            <span
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              Forks {{ repo.forksCount }}
            </span>

            <span
              class="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 sm:text-xs"
            >
              Atualizado em {{ formatGitHubDate(repo.updatedAt) }}
            </span>
          </div>

          <div class="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            <RouterLink
              to="/projetos"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:w-auto"
            >
              Voltar para projetos
            </RouterLink>

            <RouterLink
              v-if="previousRepo"
              :to="`/projetos/${encodeURIComponent(previousRepo.slug)}`"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 sm:w-auto"
            >
              Projeto anterior
            </RouterLink>

            <RouterLink
              v-if="nextRepo"
              :to="`/projetos/${encodeURIComponent(nextRepo.slug)}`"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 sm:w-auto"
            >
              Próximo projeto
            </RouterLink>

            <a
              v-if="repo.homepage"
              :href="repo.homepage"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm text-white transition hover:bg-cyan-400/20 sm:w-auto"
            >
              Ver deploy
            </a>

            <a
              :href="repo.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:w-auto"
            >
              Abrir repositório
            </a>
          </div>

          <div class="mt-6 min-h-0 flex-1 rounded-[24px] border border-white/10 bg-black/20 p-4">
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

      <aside class="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        <section
          aria-labelledby="repo-summary-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <div v-if="repo" class="flex h-full flex-col">
            <h2
              id="repo-summary-title"
              class="text-center text-[10px] uppercase tracking-[0.28em] text-emerald-300/80 sm:text-xs"
            >
              Resumo e links
            </h2>

            <div class="mt-5 flex min-h-0 flex-1 flex-col gap-4">
              <div class="min-h-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div class="overflow-visible xl:h-full xl:overflow-y-auto xl:pr-1">
                  <p class="text-sm font-medium text-white">{{ repo.name }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-400">
                    {{ repo.description }}
                  </p>
                </div>
              </div>

              <a
                :href="repo.homepage || repo.htmlUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
              >
                <p class="text-sm font-medium text-white">
                  {{ repo.homepage ? 'Ver deploy' : 'Abrir repositório' }}
                </p>
                <p class="mt-1 break-all text-sm leading-6 text-slate-400">
                  {{ repo.homepage || repo.htmlUrl }}
                </p>
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="related-repos-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="related-repos-title"
              class="text-center text-[10px] uppercase tracking-[0.28em] text-emerald-300/80 sm:text-xs"
            >
              Outros projetos
            </h2>

            <div class="mt-5 flex h-full flex-col xl:min-h-0">
              <div
                class="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:flex xl:flex-1 xl:flex-col xl:overflow-y-auto xl:pr-1"
              >
                <RouterLink
                  v-for="item in paginatedRepos"
                  :key="item.id"
                  :to="`/projetos/${encodeURIComponent(item.slug)}`"
                  class="block rounded-2xl border px-4 py-3 text-left transition"
                  :class="
                    repo?.id === item.id
                      ? 'border-cyan-400/40 bg-cyan-400/10'
                      : 'border-white/10 bg-black/20 hover:border-violet-400/30 hover:bg-violet-400/10'
                  "
                  :aria-current="repo?.id === item.id ? 'page' : undefined"
                >
                  <p class="text-sm font-medium text-white">{{ item.name }}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-400">
                    {{ item.description }}
                  </p>
                </RouterLink>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Ir para a página anterior de projetos"
                >
                  Anterior
                </button>

                <span class="text-xs text-slate-300">{{ currentPage }} / {{ totalPages }}</span>

                <button
                  type="button"
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Ir para a próxima página de projetos"
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
