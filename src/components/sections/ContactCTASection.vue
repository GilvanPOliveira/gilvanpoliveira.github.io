<script setup lang="ts">
import { profile } from '../../data/profile'
</script>

<template>
  <section id="contact" class="scroll-mt-24 py-9 sm:py-9 lg:py-9 bg-slate-900/60 text-slate-100">
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
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-300 transition text-sm flex items-center justify-center gap-2"
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.3l9 6.2 9-6.2V7H3zm0 3.1V17h18v-6.9l-7.7 5.3a2 2 0 0 1-2.6 0L3 10.1z"
            />
          </svg>
          <span>Enviar E-mail</span>
        </a>

        <button
          type="button"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-300 transition text-sm flex items-center justify-center gap-2"
          data-cal-namespace="reuniao-agendada"
          data-cal-link="gilvanpoliveira/reuniao-agendada"
          data-cal-config='{"layout":"month_view"}'
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
            <path
              transform="translate(3, 3)"
              d="M41.05 12.6c1.63-1.3 2.85-.23 2.85 1.14v20.52c0 1.73-1.22 2.44-2.85 1.14L26.79 24ZM14 8v32M4.9 17.16h21.89v13.68H4.9m0-13.68L14 8h18.5a3.2 3.2 0 0 1 2.85 2.85v26.26A3.2 3.2 0 0 1 32.5 40H7.75a2.81 2.81 0 0 1-2.85-2.89Z"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Agendar uma reunião</span>
        </button>
      </div>
      <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 pt-0">
        <a
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-300 transition text-sm flex items-center justify-center gap-2"
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .5C5.73.5.75 5.62.75 12c0 5.11 3.29 9.44 7.86 10.98.58.11.79-.26.79-.57v-2.2c-3.2.71-3.87-1.58-3.87-1.58-.52-1.35-1.27-1.71-1.27-1.71-1.04-.73.08-.72.08-.72 1.15.08 1.76 1.2 1.76 1.2 1.02 1.78 2.67 1.27 3.32.97.1-.76.4-1.27.72-1.56-2.55-.3-5.23-1.3-5.23-5.77 0-1.27.44-2.31 1.16-3.12-.12-.3-.5-1.5.11-3.11 0 0 .95-.31 3.11 1.19.9-.26 1.87-.39 2.83-.39.96 0 1.93.13 2.83.39 2.16-1.5 3.11-1.19 3.11-1.19.61 1.61.23 2.81.11 3.11.72.81 1.16 1.85 1.16 3.12 0 4.49-2.69 5.47-5.25 5.76.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.79.57 4.57-1.54 7.86-5.87 7.86-10.98C23.25 5.62 18.27.5 12 .5z"
            />
          </svg>
          <span>Github</span>
        </a>

        <a
          v-if="profile.linkedin"
          :href="profile.linkedin"
          target="_blank"
          rel="noreferrer"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-300 transition text-sm flex items-center justify-center gap-2"
        >
          <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.56V9H3.56v11.45Z"
            />
          </svg>
          <span>Linkedin</span>
        </a>
      </div>
    </div>
  </section>
</template>
