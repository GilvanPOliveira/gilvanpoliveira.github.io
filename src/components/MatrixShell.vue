<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import profileImg from '../assets/perfil.png'

const route = useRoute()

const links = [
  { label: 'Home', to: '/' },
  { label: 'Projetos', to: '/projetos' },
  { label: 'Sobre mim', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
    <div class="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-30"></div>

    <div
      class="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"
    ></div>
    <div
      class="absolute bottom-12 right-[-6rem] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl"
    ></div>
    <div
      class="absolute left-1/2 top-1/3 h-60 w-60 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl"
    ></div>

    <div
      class="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center"
    >
      <div
        class="noise-overlay panel-blur relative grid min-h-[600px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-panel shadow-glow lg:grid-cols-[260px_minmax(0,1fr)]"
      >
        <aside
          class="border-b border-white/10 p-4 min-[350px]:grid min-[350px]:grid-cols-[180px_minmax(0,1fr)] min-[350px]:items-center min-[350px]:gap-6 lg:block lg:border-b-0 lg:border-r lg:p-6"
        >
          <div class="mb-4 min-[350px]:mb-1 lg:mb-3">
            <div class="flex items-center justify-center">
              <img
                :src="profileImg"
                alt="Perfil"
                class="h-40 w-40 rounded-xl border border-white/10 object-cover shadow-[0_0_20px_rgba(34,211,238,0.15)] min-[350px]:h-40 min-[350px]:w-44 lg:h-40 lg:w-48"
              />
            </div>

            <div class="p-2 text-center">
              <h1 class="text-lg font-semibold text-white">Gilvan Oliveira</h1>
              <p class="text-xs text-slate-400">Fullstack Developer</p>
            </div>
          </div>

          <nav class="space-y-3 px-2 min-[350px]:px-0 lg:px-2">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition"
              :class="
                route.path === link.to
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white'
              "
            >
              <span>{{ link.label }}</span>
              <span class="text-xs opacity-70">↗</span>
            </RouterLink>
          </nav>
        </aside>

        <main class="flex min-h-0 flex-col">
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
