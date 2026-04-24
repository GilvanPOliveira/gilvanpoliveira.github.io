<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import MatrixShell from '../components/MatrixShell.vue';
import { useGitHubPortfolio } from '../composables/useGitHubPortfolio';
import { routeSeo } from '../data/site';
import { formatGitHubDate } from '../services/github';
import { getScrollBehavior } from '../utils/motion';
import { applySeo } from '../utils/seo';

const route = useRoute();
const router = useRouter();

const {
  repos,
  repoProjects,
  loadingRepos,
  loadingRepoProjects,
  reposError,
  repoProjectsError,
  loadRepos,
  loadRepoProjects,
} = useGitHubPortfolio();

const currentPage = ref(1);
const perPage = ref(3);
const detailArticle = ref<HTMLElement | null>(null);
let resizeFrame = 0;

const slug = computed(() => String(route.params.slug ?? ''));
const projectSlug = computed(() => String(route.query.project ?? ''));

const repo = computed(() => repos.value.find((item) => item.slug === slug.value) ?? null);

const selectedProject = computed(() => {
  if (!repoProjects.value.length) {
    return null;
  }

  return repoProjects.value.find((project) => project.slug === projectSlug.value) ?? repoProjects.value[0];
});

const projectsRoute = computed(() => ({
  path: '/projetos',
  query: repo.value
    ? {
        repo: repo.value.slug,
      }
    : undefined,
}));

const selectedProjectDeployDisabled = computed(() => {
  if (!selectedProject.value?.deployUrl) {
    return true;
  }

  try {
    const deployUrl = new URL(selectedProject.value.deployUrl);
    return deployUrl.hostname.toLowerCase() === 'gilvanpoliveira.github.io';
  } catch {
    return true;
  }
});

const totalPages = computed(() => Math.max(1, Math.ceil(repoProjects.value.length / perPage.value)));

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return repoProjects.value.slice(start, start + perPage.value);
});

const currentProjectIndex = computed(() => {
  if (!selectedProject.value) {
    return -1;
  }

  return repoProjects.value.findIndex((item) => item.slug === selectedProject.value?.slug);
});

function syncCurrentPage() {
  if (!selectedProject.value || currentProjectIndex.value < 0) {
    return;
  }

  currentPage.value = Math.floor(currentProjectIndex.value / perPage.value) + 1;
}

function clampCurrentPage() {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }

  if (currentPage.value < 1) {
    currentPage.value = 1;
  }
}

function updatePerPage() {
  const width = window.innerWidth;
  perPage.value = width >= 640 && width < 1280 ? 4 : 3;
}

function handleResize() {
  if (resizeFrame) {
    return;
  }

  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0;
    const previousPerPage = perPage.value;
    updatePerPage();

    if (previousPerPage !== perPage.value) {
      if (selectedProject.value) {
        syncCurrentPage();
      } else {
        clampCurrentPage();
      }
    }
  });
}

async function scrollToSelectedProject() {
  await nextTick();
  detailArticle.value?.scrollIntoView({
    block: 'start',
    behavior: getScrollBehavior(),
  });
}

function replaceProjectQuery(nextProjectSlug: string) {
  if (!repo.value) {
    return;
  }

  return router.replace({
    path: `/projetos/${encodeURIComponent(repo.value.slug)}`,
    query: {
      project: nextProjectSlug,
    },
  });
}

async function selectProject(nextProjectSlug: string) {
  const index = repoProjects.value.findIndex((item) => item.slug === nextProjectSlug);

  if (index >= 0) {
    currentPage.value = Math.floor(index / perPage.value) + 1;
  }

  await replaceProjectQuery(nextProjectSlug);
  await scrollToSelectedProject();
}

function goToPage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value);
  currentPage.value = nextPage;
}

function redirectToNotFound() {
  const pathMatch = route.path.replace(/^\/+/, '').split('/').filter(Boolean);

  router.replace({
    name: 'not-found',
    params: {
      pathMatch,
    },
  });
}

watch(
  repo,
  (currentRepo) => {
    if (!currentRepo) {
      if (!loadingRepos.value && repos.value.length) {
        redirectToNotFound();
      }

      applySeo({
        title: routeSeo.projectDetail.title,
        description: routeSeo.projectDetail.description,
        path: '/projetos',
      });
      return;
    }

    void loadRepoProjects(currentRepo);
    applySeo({
      title: `${currentRepo.name} | Projetos | Gilvan Oliveira`,
      description: currentRepo.description,
      path: `/projetos/${encodeURIComponent(currentRepo.slug)}`,
    });
  },
  { immediate: true }
);

watch(
  [repos, loadingRepos],
  ([currentRepos, isLoading]) => {
    if (!isLoading && currentRepos.length && !repo.value) {
      redirectToNotFound();
    }
  },
  { deep: true }
);

watch(
  [repoProjects, loadingRepoProjects],
  ([currentProjects, isLoading]) => {
    if (isLoading || !repo.value || !currentProjects.length) {
      return;
    }

    const hasProjectInRoute = currentProjects.some((project) => project.slug === projectSlug.value);

    if (!hasProjectInRoute) {
      replaceProjectQuery(currentProjects[0].slug);
      return;
    }

    syncCurrentPage();
  },
  { deep: true }
);

watch(
  () => route.query.project,
  () => {
    syncCurrentPage();
  }
);

watch(perPage, () => {
  clampCurrentPage();
});

onMounted(async () => {
  updatePerPage();
  window.addEventListener('resize', handleResize);
  await loadRepos();

  if (!repos.value.length) {
    return;
  }

  if (!repo.value) {
    redirectToNotFound();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);

  if (resizeFrame) {
    window.cancelAnimationFrame(resizeFrame);
  }
});
</script>

<template>
  <MatrixShell>
    <section class="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <article
        ref="detailArticle"
        class="min-w-0 rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
        :aria-busy="loadingRepos || loadingRepoProjects"
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

        <div
          v-else-if="loadingRepoProjects"
          class="flex min-h-[320px] items-center justify-center text-center text-sm text-slate-400 xl:h-full"
          role="status"
          aria-live="polite"
        >
          Buscando projetos com deploy neste repositório...
        </div>

        <div
          v-else-if="repoProjectsError"
          class="flex min-h-[320px] items-center justify-center text-center text-sm text-rose-300 xl:h-full"
          role="status"
          aria-live="polite"
        >
          {{ repoProjectsError }}
        </div>

        <div
          v-else-if="repo && !selectedProject"
          class="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center text-sm text-slate-400 xl:h-full"
        >
          <p>Este repositório ainda não possui projetos internos com deploy publicado.</p>

          <RouterLink
            :to="projectsRoute"
            class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10"
          >
            Voltar
          </RouterLink>
        </div>

        <div v-else-if="repo && selectedProject" class="flex h-full min-w-0 min-h-0 flex-col">
          <p class="text-[10px] uppercase tracking-[0.28em] text-cyan-300/80 [overflow-wrap:anywhere] sm:text-xs">
            Repositório selecionado: {{ repo.name }}
          </p>

          <h2 class="mt-3 text-xl font-semibold text-slate-100 [overflow-wrap:anywhere] sm:text-2xl lg:text-3xl">
            {{ selectedProject.name }}
          </h2>

          <p class="mt-4 text-sm leading-7 text-slate-300 [overflow-wrap:anywhere]">
            {{ selectedProject.description }}
          </p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span class="max-w-full rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 [overflow-wrap:anywhere] sm:text-xs">
              {{ repo.name }}
            </span>

            <span class="max-w-full rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 [overflow-wrap:anywhere] sm:text-xs">
              {{ selectedProject.path }}
            </span>

            <span
              v-if="repo.language"
              class="max-w-full rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 [overflow-wrap:anywhere] sm:text-xs"
            >
              {{ repo.language }}
            </span>

            <span class="max-w-full rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-200 [overflow-wrap:anywhere] sm:text-xs">
              Criado em {{ formatGitHubDate(repo.createdAt) }}
            </span>
          </div>

          <div class="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            <RouterLink
              :to="projectsRoute"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:w-auto"
            >
              Voltar para os repositórios
            </RouterLink>

            <a
              v-if="!selectedProjectDeployDisabled"
              :href="selectedProject.deployUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm text-white transition hover:bg-cyan-400/20 sm:w-auto"
            >
              Ver deploy
            </a>

            <button
              v-else
              type="button"
              disabled
              class="inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-500 opacity-70 sm:w-auto"
              title="Deploy indisponível para este projeto"
              aria-disabled="true"
            >
              Ver deploy
            </button>

            <a
              :href="selectedProject.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:w-auto"
            >
              Abrir repositório
            </a>
          </div>

          <div class="mt-5 hidden min-h-0 flex-1 pb-8 sm:block">
            <p class="mb-4 text-[10px] uppercase tracking-[0.28em] text-violet-300/80 sm:text-xs">
              README
            </p>

            <div
              class="h-[320px] overflow-y-auto rounded-[18px] border border-white/10 bg-slate-950/80 p-4 sm:h-[360px] lg:h-[420px] xl:h-full xl:min-h-0"
              aria-live="polite"
            >
              <pre class="whitespace-pre-wrap break-words text-xs leading-6 text-slate-200 sm:text-sm sm:leading-7">{{ selectedProject.readme }}</pre>
            </div>
          </div>
        </div>
      </article>

      <aside class="grid min-w-0 gap-6">
        <section
          aria-labelledby="repo-projects-title"
          class="min-w-0 rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[560px] xl:overflow-hidden"
        >
          <div class="flex h-full min-w-0 flex-col">
            <h2
              id="repo-projects-title"
              class="text-center text-[10px] uppercase tracking-[0.28em] text-emerald-300/80 sm:text-xs"
            >
              Projetos neste repositório
            </h2>

            <div class="mt-5 flex h-full min-w-0 flex-col xl:min-h-0">
              <div
                v-if="loadingRepoProjects"
                class="flex min-h-[180px] items-center justify-center text-center text-sm text-slate-400 xl:flex-1"
                role="status"
              >
                Carregando projetos...
              </div>

              <div
                v-else-if="repoProjectsError"
                class="flex min-h-[180px] items-center justify-center text-center text-sm text-rose-300 xl:flex-1"
                role="status"
              >
                {{ repoProjectsError }}
              </div>

              <div
                v-else-if="!repoProjects.length"
                class="flex min-h-[180px] items-center justify-center text-center text-sm leading-6 text-slate-400 xl:flex-1"
              >
                Nenhum projeto com deploy publicado foi encontrado neste repositório.
              </div>

              <div
                v-else
                class="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:min-h-0 xl:flex-col xl:overflow-y-auto xl:pr-1"
              >
                <button
                  v-for="project in paginatedProjects"
                  :key="project.id"
                  type="button"
                  @click="selectProject(project.slug)"
                  class="block min-w-0 w-full rounded-2xl border px-4 py-3 text-left transition"
                  :class="
                    selectedProject?.id === project.id
                      ? 'border-cyan-400/40 bg-cyan-400/10'
                      : 'border-white/10 bg-black/20 hover:border-violet-400/30 hover:bg-violet-400/10'
                  "
                  :aria-pressed="selectedProject?.id === project.id"
                >
                  <p class="text-sm font-medium text-white [overflow-wrap:anywhere]">{{ project.name }}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-400 [overflow-wrap:anywhere]">
                    {{ project.description }}
                  </p>
                </button>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1 || !repoProjects.length"
                  class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Ir para a pagina anterior de projetos"
                >
                  Anterior
                </button>

                <span class="text-xs text-slate-300">{{ currentPage }} / {{ totalPages }}</span>

                <button
                  type="button"
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages || !repoProjects.length"
                  class="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Ir para a proxima pagina de projetos"
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
