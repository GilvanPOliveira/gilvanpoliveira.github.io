<script setup lang="ts">
import { featuredProjects } from '../../data/featuredProjects';

const projects = featuredProjects;

const statusLabel = {
  online: 'Online',
  building: 'Em construção',
  lab: 'Experimento',
} as const;

const statusClass = {
  online: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  building: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
  lab: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
} as const;

type StatusKey = keyof typeof statusLabel;

const normalizeStatus = (status: string): StatusKey | null => {
  const normalized = status.toLowerCase().trim() as StatusKey;
  return normalized in statusLabel ? normalized : null;
};

const getStatusLabel = (status: string): string => {
  const key = normalizeStatus(status);
  if (key) return statusLabel[key];
  return status;
};

const getStatusClass = (status: string): string => {
  const key = normalizeStatus(status);
  if (key) return statusClass[key];
  return 'border-slate-600/70 bg-slate-900/60 text-slate-300';
};
</script>

<template>
  <section
    id="projects"
    class="scroll-mt-24 py-12 sm:py-10 lg:py-10 bg-slate-900/60 text-slate-100"
  >
    <div class="max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
      <header
        class="space-y-2"
      >
        <p
          class="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400"
        >
          Projetos em destaque
        </p>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold">
          Projetos que representam meu trabalho
        </h2>
        <p class="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl">
          Uma curadoria dos projetos que mais traduzem a forma como eu penso sobre produto, arquitetura e experiência.
        </p>
      </header>

      <div class="grid gap-4 sm:gap-6 md:grid-cols-2">
        <article
          v-for="(project, index) in projects"
          :key="project.id"
          v-reveal="{ delay: index * 80, glow: true }"
          class="group relative flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div
            class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
          >
            <div class="space-y-1">
              <h3 class="text-base sm:text-lg font-semibold">
                {{ project.name }}
              </h3>
              <p class="text-[11px] sm:text-[9px] text-emerald-300">
                {{ project.tagline }}
              </p>
            </div>

            <span
              class="self-start rounded-full border px-2.5 py-1 text-[10px] sm:text-[9px] font-medium uppercase tracking-wide mt-1 sm:mt-0"
              :class="getStatusClass(project.status)"
            >
              {{ getStatusLabel(project.status) }}
            </span>
          </div>

          <p class="mt-3 text-xs sm:text-sm text-slate-300">
            {{ project.description }}
          </p>

          <div
            class="mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-300"
          >
            <span
              v-for="tech in project.techStack"
              :key="tech"
              class="rounded-full border border-slate-700/80 bg-slate-900/60 px-2.5 py-1"
            >
              {{ tech }}
            </span>
          </div>

          <p class="mt-3 text-[11px] sm:text-xs text-slate-400">
            Papel:
            <span class="text-slate-200">{{ project.role }}</span>
          </p>

          <div
            class="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-1 text-xs sm:text-sm"
          >
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex justify-center sm:justify-start items-center gap-1 rounded-full bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Ver online
              <span aria-hidden="true">↗</span>
            </a>

            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex justify-center sm:justify-start items-center gap-1 rounded-full border border-slate-700 px-4 py-2 font-medium text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Ver código
              <span aria-hidden="true">&lt;/&gt;</span>
            </a>

            <span
              v-if="!project.liveUrl && !project.githubUrl"
              class="text-[11px] text-slate-500"
            >
              Links serão adicionados quando o projeto estiver publicado.
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
