<script setup lang="ts">
import MatrixShell from '../components/MatrixShell.vue';
import StackStrip from '../components/StackStrip.vue';
import { studyStackGroups } from '../data/profile';
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-6 sm:p-8 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col">
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Sobre mim</p>

          <div class="overflow-auto text-justify py-2 pr-6">
            <p class="mt-3 max-w-2x1 text-base leading-7 text-slate-300">
              Desenvolvedor Full Stack com foco em construção de aplicações web completas, atuando
              desde a modelagem de dados e definição de regras de negócio até o desenvolvimento de
              interfaces no frontend. Trabalho com JavaScript/TypeScript e desenvolvimento de Web
              Apps (SPA/PWA). No frontend, utilizo Vue, React e Angular; no backend, desenvolvo e
              integro APIs REST com Python (Flask/FastAPI), utilizando bancos de dados relacionais
              como PostgreSQL e MySQL.
            </p>

            <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Tenho como prioridade a organização do código, separação de responsabilidades e
              consistência arquitetural, buscando construir sistemas previsíveis, de fácil
              manutenção e evolução. Também tenho atenção a performance, acessibilidade (a11y) e
              responsividade, garantindo interfaces claras, funcionais e bem estruturadas.
            </p>

            <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Sou Pessoa com Deficiência (PCD) e busco oportunidades em ambientes que valorizem
              diversidade, colaboração e crescimento técnico. Atualmente, estou em busca da minha
              primeira oportunidade como Desenvolvedor Full Stack, onde eu possa contribuir com
              consistência, aprender com o time e evoluir continuamente.
            </p>

            <div class="mt-auto flex flex-wrap gap-3 pt-8">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                class="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/20"
              >
                Ver LinkedIn
              </a>

              <a
                href="https://github.com/GilvanPOliveira"
                target="_blank"
                rel="noreferrer"
                class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white"
              >
                Ver GitHub
              </a>
            </div>
          </div>
        </div>
      </article>

      <aside class="grid gap-7">
        <div
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[560px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <p class="text-xs uppercase tracking-[0.3em] text-violet-300/80 text-center">
              Stacks já estudadas
            </p>

            <div class="mt-5 flex-1 overflow-y-auto pr-1">
              <div class="space-y-4">
                <div
                  v-for="group in studyStackGroups"
                  :key="group.title"
                  class="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-300">
                    {{ group.title }}
                  </p>

                  <div class="mt-3">
                    <StackStrip :items="group.items" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </MatrixShell>
</template>
