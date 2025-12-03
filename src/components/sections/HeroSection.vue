<script setup lang="ts">
import { profile } from '../../data/profile'
</script>

<template>
  <section
    id="hero"
    class="scroll-mt-24 min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center bg-slate-950/60 text-slate-100 pt-10 pb-10"
  >
    <div class="w-full max-w-3xl px-4 text-center space-y-4 sm:space-y-6">
      <a
        href="https://github.com/GilvanPOliveira"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir GitHub de Gilvan Oliveira"
        class="inline-block w-fit mx-auto"
      >
        <img
          src="../../assets/perfil.png"
          alt="Foto de perfil de Gilvan Oliveira"
          width="128"
          height="128"
          class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-200 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/20"
        />
      </a>
      <p class="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-emerald-400">
        - Portifólio -
      </p>

      <h1 class="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
        {{ profile.name }}
      </h1>

      <p class="text-base sm:text-lg md:text-xl text-slate-300">
        {{ profile.headline }}
      </p>

      <p class="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto">
        {{ profile.shortBio }}
      </p>

      <ul
        class="flex flex-wrap justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-300"
      >
        <li
          v-for="role in profile.roles"
          :key="role"
          class="rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1"
        >
          {{ role }}
        </li>
      </ul>

      <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 pt-3 sm:pt-4">
        <a
          v-reveal="{ glow: true }"
          href="#projects"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-100 transition text-sm"
        >
          Ver projetos em destaque
        </a>

        <a
          v-reveal="{ glow: true }"
          href="#lab"
          class="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-600 text-slate-100 font-medium hover:border-emerald-400 hover:text-emerald-100 transition text-sm"
        >
          Ir para o laboratório
        </a>
      </div>
    </div>
  </section>
</template>
