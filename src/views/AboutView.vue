<script setup lang="ts">
import MatrixShell from '../components/MatrixShell.vue';
import StackStrip from '../components/StackStrip.vue';
import { studyStackGroups } from '../data/profile';
import { siteConfig } from '../data/site';
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col">
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Trajetória</p>

          <h1 class="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">Sobre mim</h1>

          <div
            class="overflow-visible py-2 pr-0 text-justify sm:pr-2 xl:flex-1 xl:overflow-y-auto xl:pr-4"
          >
            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Sou {{ siteConfig.role }}, com foco na construção de aplicações web completas, desde a
              modelagem de dados e definição de regras de negócio até a entrega de interfaces bem
              estruturadas no frontend. Trabalho com JavaScript, TypeScript e desenvolvimento de Web
              Apps em Vue, React e Angular, além de APIs REST em Python com Flask e FastAPI.
            </p>

            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Priorizo organização de código, separação de responsabilidades e consistência
              arquitetural para que o sistema permaneça previsível, escalável e simples de manter.
              Também dedico atenção a performance, acessibilidade e responsividade para garantir uma
              experiência sólida em diferentes contextos de uso.
            </p>

            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Sou Pessoa com Deficiência (PCD) e estou em busca de oportunidades que valorizem
              diversidade, colaboração e evolução contínua. Quero contribuir com consistência,
              aprender com o time e crescer em projetos de impacto real.
            </p>

            <div class="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <a
                :href="siteConfig.linkedinUrl"
                target="_blank"
                rel="me noopener noreferrer"
                class="inline-flex w-fit items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/20"
              >
                Ver LinkedIn
              </a>

              <a
                :href="siteConfig.githubUrl"
                target="_blank"
                rel="me noopener noreferrer"
                class="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white"
              >
                Ver GitHub
              </a>
            </div>
          </div>
        </div>
      </article>

      <aside class="grid gap-6">
        <section
          aria-labelledby="study-stacks-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[560px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="study-stacks-title"
              class="text-center text-xs uppercase tracking-[0.3em] text-violet-300/80"
            >
              Stacks estudadas
            </h2>

            <div
              class="overflow-visible py-2 pr-0 text-center sm:pr-2 xl:flex-1 xl:overflow-y-auto xl:pr-4"
            >
              <div class="space-y-4">
                <section
                  v-for="group in studyStackGroups"
                  :key="group.title"
                  class="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <h3 class="text-xs uppercase tracking-[0.25em] text-slate-300">
                    {{ group.title }}
                  </h3>

                  <div class="mt-3">
                    <StackStrip :items="group.items" />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </MatrixShell>
</template>
