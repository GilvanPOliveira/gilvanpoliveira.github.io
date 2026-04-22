<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import MatrixShell from '../components/MatrixShell.vue'

const route = useRoute()
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Erro 404</p>

            <h1 class="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              A página que você procurou não foi encontrada.
            </h1>

            <p class="mt-6 max-w-3xl text-base leading-7 text-slate-300">
              O endereço pode ter sido alterado, removido ou digitado incorretamente. Você pode
              voltar para a home, abrir a área de projetos ou seguir por uma das páginas principais
              do portfólio.
            </p>

            <div class="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <p class="text-xs uppercase tracking-[0.24em] text-slate-400">Endereço acessado</p>
              <p class="mt-2 break-all text-sm text-slate-200">{{ route.fullPath }}</p>
            </div>
          </div>

          <div class="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <RouterLink
              to="/"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/20 sm:w-auto"
            >
              Ir para a home
            </RouterLink>

            <RouterLink
              to="/projetos"
              class="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white sm:w-auto"
            >
              Ver projetos
            </RouterLink>
          </div>
        </div>
      </article>

      <aside class="grid gap-6">
        <section
          aria-labelledby="links-uteis-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[560px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="links-uteis-title"
              class="text-center text-xs uppercase tracking-[0.3em] text-emerald-300/80"
            >
              Links úteis
            </h2>

            <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <RouterLink
                to="/sobre"
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-violet-400/40 hover:bg-violet-400/10"
              >
                <p class="text-sm font-medium text-white">Sobre mim</p>
                <p class="mt-2 text-sm leading-6 text-slate-400">
                  Trajetória, formações e stacks estudadas.
                </p>
              </RouterLink>

              <RouterLink
                to="/contato"
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
              >
                <p class="text-sm font-medium text-white">Contato</p>
                <p class="mt-2 text-sm leading-6 text-slate-400">
                  GitHub, LinkedIn, email e agendamento.
                </p>
              </RouterLink>

              <RouterLink
                to="/projetos"
                class="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 md:col-span-2 xl:col-span-1"
              >
                <p class="text-sm font-medium text-white">Projetos</p>
                <p class="mt-2 text-sm leading-6 text-slate-400">
                  Repositórios públicos, detalhes técnicos e README completo.
                </p>
              </RouterLink>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </MatrixShell>
</template>
