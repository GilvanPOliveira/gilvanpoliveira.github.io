<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import profileImg from '../assets/perfil.jpg'
import { navLinks, siteConfig } from '../data/site'

const route = useRoute()

function isActiveLink(to: string) {
  if (to === '/') {
    return route.path === '/'
  }

  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden px-3 py-3 sm:px-5 sm:py-5 lg:px-10 lg:py-6">
    <div class="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-30"></div>

    <div
      class="relative mx-auto flex w-full max-w-7xl items-start justify-center lg:min-h-[calc(100vh-3rem)] lg:items-center"
    >
      <div
        class="noise-overlay panel-blur relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-panel shadow-glow lg:grid lg:min-h-[600px] lg:grid-cols-[260px_minmax(0,1fr)]"
      >
        <aside
          aria-label="Perfil e navegação"
          class="border-b border-white/10 p-4 sm:grid sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-6 sm:p-5 lg:flex lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:p-6"
        >
          <div class="w-full sm:contents lg:block">
            <header class="mb-4 sm:mb-1 lg:mb-6">
              <div class="flex items-center justify-center">
                <RouterLink
                  to="/"
                  class="rounded-[20px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                  aria-label="Ir para a página inicial"
                >
                  <img
                    :src="profileImg"
                    :alt="`Foto de perfil de ${siteConfig.name}`"
                    width="320"
                    height="385"
                    class="h-36 w-36 rounded-xl border border-white/10 object-cover shadow-[0_0_20px_rgba(34,211,238,0.15)] sm:h-44 sm:w-44 lg:h-48 lg:w-48"
                    decoding="async"
                    fetchpriority="high"
                  />
                </RouterLink>
              </div>

              <div class="p-2 text-center">
                <p class="text-lg font-semibold text-white">{{ siteConfig.name }}</p>
                <p class="text-xs text-slate-400">{{ siteConfig.roleShort }}</p>
              </div>
            </header>

            <nav
              class="grid grid-cols-2 gap-3 px-0 sm:grid-cols-1 sm:px-2 md:grid-cols-2 lg:grid-cols-1 lg:px-2"
              aria-label="Navegação principal"
            >
              <RouterLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="flex min-h-[56px] items-center justify-between rounded-2xl border px-4 py-4 text-sm transition"
                :class="
                  isActiveLink(link.to)
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white'
                "
              >
                <span>{{ link.label }}</span>
                <span class="text-xs opacity-70" aria-hidden="true">↗</span>
              </RouterLink>
            </nav>
          </div>
        </aside>

        <main id="conteudo-principal" tabindex="-1" class="flex min-h-0 min-w-0 flex-col">
          <div class="min-h-0 flex-1 overflow-visible px-4 py-4 sm:px-6 sm:py-6 xl:overflow-y-auto">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
