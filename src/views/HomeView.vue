<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MatrixShell from '../components/MatrixShell.vue';
import StackStrip from '../components/StackStrip.vue';
import { coreStacks, formations, formationsTec } from '../data/profile';
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-6 sm:p-8 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col">
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Hello there,</p>

          <p class="mt-6 max-w-2xl text-base leading-7 text-slate-300 text-justify">
            me chamo Gilvan Oliveira, Desenvolvedor Full Stack. Construo aplicações web completas
            (SPA/PWA) com JavaScript/TypeScript no frontend (Vue, React e Angular) e Python no
            backend, integrando APIs REST e bancos relacionais. Tenho foco em arquitetura limpa,
            código organizado e sistemas fáceis de manter e evoluir, sempre com atenção à
            performance, acessibilidade e responsividade. Sou PCD e busco minha primeira
            oportunidade para contribuir, aprender e crescer com o time.
          </p>

          <div class="mt-5 flex flex-wrap gap-3 justify-center">
            <RouterLink
              to="/projetos"
              class="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/20"
            >
              Ver projetos
            </RouterLink>

            <RouterLink
              to="/sobre"
              class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white"
            >
              Sobre mim
            </RouterLink>
          </div>
          <div class="mt-6">
            <p class="text-xs uppercase tracking-[0.3em] text-violet-300/80 text-center">Stacks</p>

            <div class="mt-6">
              <StackStrip :items="coreStacks" />
            </div>
          </div>
        </div>
      </article>

      <aside class="grid gap-7">
        <div
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <p class="text-xs text-center uppercase tracking-[0.3em] text-emerald-300/80">
            Graduação
          </p>
          <div class="mt-5 space-y-4">
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

        <div
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <p class="text-xs text-center uppercase tracking-[0.3em] text-emerald-300/80">Cursos</p>
          <div class="mt-5 space-y-4">
            <div
              v-for="formation in formationsTec"
              :key="formation.title"
              class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
            >
              <p class="text-sm font-medium text-white">{{ formation.title }}</p>
              <p class="mt-1text-sm leading-6 text-slate-400">
                {{ formation.value }}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </MatrixShell>
</template>
