<script setup lang="ts">
import { profile } from '../../data/profile'
</script>

<template>
  <section id="contact" class="scroll-mt-24 py-12 sm:py-16 lg:py-24 bg-slate-900/60 text-slate-100">
    <div class="max-w-3xl mx-auto px-4 text-center space-y-5 sm:space-y-6">
      <p class="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
        Contato
      </p>
      <h2 class="text-xl sm:text-2xl md:text-3xl font-bold">
        Bora conversar sobre o próximo projeto?
      </h2>
      <p class="text-xs sm:text-sm md:text-base text-slate-400">
        Se quiser falar sobre oportunidades, projetos ou ideias, estes são os canais mais diretos
        para falar comigo.
      </p>

      <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 pt-2">
        <a
          :href="`mailto:${profile.email}`"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition text-sm"
        >
          Enviar email
        </a>

        <a
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-300 transition text-sm"
        >
          Ver GitHub
        </a>

        <a
          v-if="profile.linkedin"
          :href="profile.linkedin"
          target="_blank"
          rel="noreferrer"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-300 transition text-sm"
        >
          Ver LinkedIn
        </a>
      </div>
    </div>
  </section>
</template>
