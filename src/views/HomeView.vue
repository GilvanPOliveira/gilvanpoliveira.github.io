<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import MatrixShell from '../components/MatrixShell.vue';
import StackStrip from '../components/StackStrip.vue';
import { coreStacks, formations, technicalCourses, type StackItem } from '../data/profile';
import { siteConfig } from '../data/site';
import { fetchGitHubTopStacks } from '../services/github';

const githubStacks = ref<StackItem[]>([]);
const isLoadingStacks = ref(true);

const displayStacks = computed(() => {
  return githubStacks.value.length ? githubStacks.value : coreStacks;
});

const stackHelperText = computed(() => {
  if (isLoadingStacks.value) {
    return 'Carregando sinais do GitHub...';
  }

  if (githubStacks.value.length) {
    return 'stacks mais recorrentes com base nos repositórios públicos';
  }

  return 'seleção principal usada em projetos e estudos';
});

async function loadGitHubStacks() {
  try {
    const stacks = await fetchGitHubTopStacks(7);

    if (stacks.length) {
      githubStacks.value = stacks;
    }
  } finally {
    isLoadingStacks.value = false;
  }
}

onMounted(() => {
  loadGitHubStacks();
});
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col">
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Hello there,</p>

          <h1
            class="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl"
          >
            me chamo {{ siteConfig.name }}, {{ siteConfig.role }}.
          </h1>

          <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base text-justify">
             Construo aplicações web completas
            com JavaScript e TypeScript no frontend, Python no backend e integração com APIs REST e
            bancos relacionais. Meu foco está em arquitetura limpa, código organizado, performance,
            acessibilidade e interfaces que funcionam bem em qualquer tela.
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-center">
            <RouterLink
              to="/projetos"
              class="inline-flex w-fit items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/20"
            >
              Ver projetos
            </RouterLink>

            <RouterLink
              to="/sobre"
              class="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white"
            >
              Sobre mim
            </RouterLink>
          </div>

          <section class="mt-8" aria-labelledby="stacks-destaque">
            <div class="flex flex-col items-center gap-2">
              <h2
                id="stacks-destaque"
                class="text-center text-xs uppercase tracking-[0.3em] text-violet-300/80 sm:text-left"
              >
                Stacks em destaque
              </h2>

              <p
                class="text-center text-[11px] uppercase tracking-[0.2em] text-slate-500 sm:text-left"
                aria-live="polite"
              >
                {{ stackHelperText }}
              </p>
            </div>

            <div class="mt-6">
              <StackStrip :items="displayStacks" />
            </div>
          </section>
        </div>
      </article>

      <aside class="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        <section
          aria-labelledby="formacao-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="formacao-title"
              class="text-center text-xs uppercase tracking-[0.3em] text-emerald-300/80"
            >
              Formação
            </h2>

            <div class="mt-5 space-y-4 xl:min-h-0 xl:overflow-y-auto xl:pr-1">
              <div
                v-for="formation in formations"
                :key="formation.title"
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <p class="text-sm font-medium text-white">{{ formation.title }}</p>
                <p class="text-sm leading-6 text-slate-400">
                  {{ formation.value }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="cursos-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="cursos-title"
              class="text-center text-xs uppercase tracking-[0.3em] text-emerald-300/80"
            >
              Cursos
            </h2>

            <div class="mt-5 space-y-4 xl:min-h-0 xl:overflow-y-auto xl:pr-1">
              <div
                v-for="course in technicalCourses"
                :key="course.title"
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <p class="text-sm font-medium text-white">{{ course.title }}</p>
                <p class="text-sm leading-6 text-slate-400">
                  {{ course.value }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </MatrixShell>
</template>
