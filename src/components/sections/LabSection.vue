<script setup lang="ts">
import type { LabItem } from '../../data/labItems';
import { labItems } from '../../data/labItems';

const typeLabel: Record<LabItem['type'], string> = {
  estudo: 'Estudo',
  experimento: 'Experimento',
  outro: 'Outro',
};

const typeClass: Record<LabItem['type'], string> = {
  estudo: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  experimento: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  outro: 'border-slate-500/40 bg-slate-700/30 text-slate-200',
};

const getLinkLabel = (item: LabItem): string => {
  if (!item.link) return '';

  if (item.link.includes('github.com')) {
    return 'Ver repositório';
  }

  if (item.link.startsWith('http')) {
    return 'Ver projeto';
  }

  return 'Abrir';
};
</script>

<template>
  <section
    id="lab"
    class="scroll-mt-24 py-10 sm:py-10 lg:py-10 bg-slate-950/60 text-slate-100"
  >
    <div
      class="max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8"
    >
      <header class="space-y-2">
        <p
          class="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400"
        >
          Laboratório
        </p>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold">
          Experimentos, estudos e side projects
        </h2>
        <p class="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl">
          Um espaço para concentrar o que estou estudando e testando: trilhas
          de HTML/CSS/JS, desafios com frameworks, projetos full stack e ajustes
          de firmware/3D printing.
        </p>
      </header>

      <div class="grid gap-4 sm:gap-5 md:grid-cols-3 text-xs sm:text-sm">
        <article
          v-for="item in labItems"
          :key="item.id"
          v-reveal="{ glow: true }"
          class="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-slate-100">
              {{ item.title }}
            </h3>

            <span
              class="rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide"
              :class="typeClass[item.type]"
            >
              {{ typeLabel[item.type] }}
            </span>
          </div>

          <p class="mt-2 text-slate-300">
            {{ item.description }}
          </p>

          <div
            class="mt-3 flex flex-wrap gap-1.5 text-[10px] sm:text-[11px] text-slate-300"
          >
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="rounded-full border border-slate-700/80 bg-slate-950/60 px-2.5 py-1"
            >
              {{ tag }}
            </span>
          </div>

          <div
            v-if="item.link"
            class="mt-3"
          >
            <a
              :href="item.link"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300 hover:bg-slate-900/70 transition"
            >
              {{ getLinkLabel(item) }}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
