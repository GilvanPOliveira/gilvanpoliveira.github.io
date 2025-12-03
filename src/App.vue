<script setup lang="ts">
import { ref } from 'vue'

import HeroSection from './components/sections/HeroSection.vue'
import FeaturedProjectsSection from './components/sections/FeaturedProjectsSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import StackSkillsSection from './components/sections/StackSkillsSection.vue'
import LabSection from './components/sections/LabSection.vue'
import ContactCTASection from './components/sections/ContactCTASection.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'

const mobileMenuOpen = ref(false)

const links = [
  { href: '#hero', label: 'Início' },
  { href: '#projects', label: 'Projetos' },
  { href: '#about', label: 'Sobre' },
  { href: '#stack', label: 'Stack' },
  { href: '#lab', label: 'Lab' },
  { href: '#contact', label: 'Contato' },
]

function handleNavClick() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="relative min-h-screen text-slate-100">
    <AnimatedBackground />

    <header
      class="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-sm"
    >
      <nav class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="https://github.com/GilvanPOliveira">
          <span class="font-semibold tracking-wide"> Gilvan Oliveira </span>
        </a>
        <ul class="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="hover:text-emerald-400 transition">
              {{ link.label }}
            </a>
          </li>
        </ul>

        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span v-if="!mobileMenuOpen">Menu</span>
          <span v-else>Fechar</span>
        </button>
      </nav>

      <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-800/80 bg-slate-950/95">
        <nav class="max-w-5xl mx-auto px-4 py-3">
          <ul class="flex flex-col gap-2 text-sm text-slate-300">
            <li v-for="link in links" :key="link.href">
              <a
                :href="link.href"
                class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-emerald-100 transition"
                @click="handleNavClick"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="relative z-10 pt-20 px-2 md:px-4 pb-6 md:pb-10">
      <div class="max-w-5xl mx-auto flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        <div
          class="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-md shadow-black/30 overflow-hidden"
        >
          <HeroSection />
        </div>

        <div
          class="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-md shadow-black/30 overflow-hidden"
        >
          <FeaturedProjectsSection />
        </div>

        <div
          class="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-md shadow-black/30 overflow-hidden"
        >
          <AboutSection />
        </div>

        <div
          class="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-md shadow-black/30 overflow-hidden"
        >
          <StackSkillsSection />
        </div>

        <div
          class="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-md shadow-black/30 overflow-hidden"
        >
          <LabSection />
        </div>

        <div
          class="rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-md shadow-black/30 overflow-hidden"
        >
          <ContactCTASection />
        </div>
      </div>
    </main>

    <footer class="relative z-10 mt-4 bg-slate-950 border-t border-slate-800/80">
      <div
        class="max-w-5xl mx-auto px-4 pt-3 pb-2 text-[13px] text-slate-300 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <span class="block"> © {{ new Date().getFullYear() }} Gilvan Oliveira </span>

        <span class="flex items-center gap-4">
          <a
            href="https://github.com/GilvanPOliveira"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition"
            aria-label="GitHub de Gilvan Oliveira"
          >
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 .5C5.73.5.75 5.62.75 12c0 5.11 3.29 9.44 7.86 10.98.58.11.79-.26.79-.57v-2.2c-3.2.71-3.87-1.58-3.87-1.58-.52-1.35-1.27-1.71-1.27-1.71-1.04-.73.08-.72.08-.72 1.15.08 1.76 1.2 1.76 1.2 1.02 1.78 2.67 1.27 3.32.97.1-.76.4-1.27.72-1.56-2.55-.3-5.23-1.3-5.23-5.77 0-1.27.44-2.31 1.16-3.12-.12-.3-.5-1.5.11-3.11 0 0 .95-.31 3.11 1.19.9-.26 1.87-.39 2.83-.39.96 0 1.93.13 2.83.39 2.16-1.5 3.11-1.19 3.11-1.19.61 1.61.23 2.81.11 3.11.72.81 1.16 1.85 1.16 3.12 0 4.49-2.69 5.47-5.25 5.76.41.36.78 1.08.78 2.18v3.23c0 .31.21.68.79.57 4.57-1.54 7.86-5.87 7.86-10.98C23.25 5.62 18.27.5 12 .5z"
              />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/gilvanpoliveira"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition"
            aria-label="LinkedIn de Gilvan Oliveira"
          >
            <svg class="h-5 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.56V9H3.56v11.45Z"
              />
            </svg>
          </a>
        </span>
      </div>
    </footer>
  </div>
</template>
