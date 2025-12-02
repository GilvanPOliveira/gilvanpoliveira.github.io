<script setup lang="ts">
import { skillCategories } from '../../data/skills'
</script>

<template>
  <section id="stack" class="scroll-mt-24 py-12 sm:py-16 lg:py-24 bg-slate-900/60 text-slate-100">
    <div class="max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
      <header class="space-y-2">
        <p
          class="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400"
        >
          Stack &amp; Skills
        </p>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold">
          Principais tecnologias e áreas de atuação
        </h2>
        <p class="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl">
          Um recorte das tecnologias e áreas em que atuo hoje como desenvolvedor full stack: do
          HTML/CSS/JS no frontend às APIs, dados, deploy e fluxo de desenvolvimento.
        </p>
      </header>

      <div class="grid gap-4 sm:gap-5 md:grid-cols-3 text-xs sm:text-sm">
        <div
          v-for="category in skillCategories"
          :key="category.id"
          v-reveal="{ glow: true }"
          class="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <h3 class="font-semibold text-slate-100">
            {{ category.label }}
          </h3>
          <ul class="space-y-1 text-slate-400">
            <li v-for="item in category.items" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
