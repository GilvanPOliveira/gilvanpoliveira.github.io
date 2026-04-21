<script setup lang="ts">
import { onMounted } from 'vue';
import MatrixShell from '../components/MatrixShell.vue';

declare global {
  interface Window {
    Cal?: {
      (...args: any[]): void;
      loaded?: boolean;
      ns?: Record<string, (...args: any[]) => void>;
      q?: any[];
    };
  }
}

const CAL_NAMESPACE = 'consulta-agendada';
const CAL_ORIGIN = 'https://cal.com';

function setupCalEmbed() {
  if (typeof window === 'undefined') return;
  (function (C: Window & typeof globalThis, A: string, L: string) {
    const d = C.document;

    const push = (target: { q?: any[] }, args: any[]) => {
      target.q = target.q || [];
      target.q.push(args);
    };

    C.Cal =
      C.Cal ||
      function (...args: any[]) {
        const cal = C.Cal as any;

        if (!cal.loaded) {
          cal.ns = cal.ns || {};
          cal.q = cal.q || [];
          const script = d.createElement('script');
          script.src = A;
          script.async = true;
          script.dataset.cal = 'true';
          d.head.appendChild(script);
          cal.loaded = true;
        }

        if (args[0] === L) {
          const namespace = args[1];

          const api = (...apiArgs: any[]) => {
            push(api as any, apiArgs);
          };

          (api as any).q = (api as any).q || [];

          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            push(cal.ns[namespace] as any, args);
            push(cal, ['initNamespace', namespace]);
          } else {
            push(cal, args);
          }

          return;
        }

        push(cal, args);
      };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  window.Cal?.('init', CAL_NAMESPACE, { origin: CAL_ORIGIN });

  window.Cal?.ns?.[CAL_NAMESPACE]?.('ui', {
    cssVarsPerTheme: {
      light: { 'cal-brand': '#22d3ee' },
      dark: { 'cal-brand': '#22d3ee' },
    },
    hideEventTypeDetails: false,
    layout: 'month_view',
  });
}

onMounted(() => {
  setupCalEmbed();
});
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-8 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col text-justify">
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Contato</p>

          <p class="mt-6 max-w-2xl text-base leading-7 text-slate-300">
            Se você chegou até aqui, provavelmente quer conhecer melhor meu trabalho ou abrir uma
            conversa sobre oportunidades, projetos e networking.
          </p>

          <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Ao lado estão os principais canais para me encontrar. Você pode acessar meus
            repositórios no GitHub, acompanhar meu perfil profissional no LinkedIn, falar comigo por
            email ou até agendar uma conversa rápida pelo meet.
          </p>

          <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            A ideia aqui é deixar o contato fácil, claro e acessível, sem barreiras e sem rodeios. Fico no aguardo!
          </p>

          <div class="mt-auto pt-8">
            <p class="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/80">Acesso rápido</p>

            <div class="flex flex-wrap gap-3">
              <a
                href="https://github.com/GilvanPOliveira"
                target="_blank"
                rel="noreferrer"
                class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-white"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/gilvanpoliveira/"
                target="_blank"
                rel="noreferrer"
                class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white"
              >
                LinkedIn
              </a>

              <a
                href="mailto:gilvanoliveira06@gmail.com"
                class="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-white"
              >
                Email
              </a>
              <a
                href="#"
                title="Cal.com"
                data-cal-namespace="consulta-agendada"
                data-cal-link="gilvanpoliveira/reuniao-agendada"
                data-cal-config='{"layout":"month_view"}'
                class="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-400/20"
              >
                Agende uma reunião
              </a>
            </div>
          </div>
        </div>
      </article>

      <aside class="grid gap-6">
        <div
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <p class="text-xs text-center uppercase tracking-[0.3em] text-emerald-300/80">
            Minhas Redes
          </p>

          <div class="mt-5 space-y-4">
            <a
              href="https://github.com/GilvanPOliveira"
              target="_blank"
              rel="noreferrer"
              class="group block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-white">
                    Repositórios, labs e histórico técnico
                  </p>
                  <p class="mt-1 text-sm leading-6 text-slate-400">github.com/GilvanPOliveira</p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.724.5.096.682-.223.682-.496 0-.245-.009-.894-.014-1.754-2.782.621-3.37-1.37-3.37-1.37-.455-1.183-1.11-1.498-1.11-1.498-.908-.638.069-.625.069-.625 1.003.072 1.53 1.053 1.53 1.053.892 1.565 2.341 1.113 2.91.851.091-.665.349-1.113.635-1.369-2.22-.259-4.555-1.137-4.555-5.06 0-1.118.389-2.033 1.026-2.75-.103-.26-.445-1.302.097-2.714 0 0 .838-.276 2.747 1.05A9.303 9.303 0 0 1 12 6.93c.85.004 1.705.117 2.504.345 1.908-1.326 2.744-1.05 2.744-1.05.544 1.412.202 2.454.1 2.714.639.717 1.024 1.632 1.024 2.75 0 3.932-2.338 4.798-4.566 5.052.359.317.679.941.679 1.897 0 1.37-.012 2.475-.012 2.812 0 .276.18.597.688.495A10.264 10.264 0 0 0 22 12.25C22 6.59 17.523 2 12 2Z"
                  />
                </svg>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/gilvanpoliveira/"
              target="_blank"
              rel="noreferrer"
              class="group block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/10"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-white">Perfil profissional / Networking</p>
                  <p class="mt-1 text-sm leading-6 text-slate-400">
                    linkedin.com/in/gilvanpoliveira
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M6.94 8.5H3.56V20h3.38V8.5Zm-1.69-5A1.97 1.97 0 0 0 3.25 5.5c0 1.08.79 1.95 1.98 1.95h.02c1.22 0 1.98-.87 1.98-1.95A1.93 1.93 0 0 0 5.27 3.5h-.02ZM20.75 13.1c0-3.13-1.67-4.59-3.91-4.59-1.8 0-2.6 1.02-3.05 1.74V8.5h-3.38c.04 1.16 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.68.88-1.39 1.91-1.39 1.35 0 1.89 1.05 1.89 2.6V20H21v-6.9l-.25.01Z"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>

        <div
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 xl:h-[265px] xl:overflow-hidden"
        >
          <div class="space-y-3">
            <a
              href="mailto:gilvanoliveira06@gmail.com"
              class="group block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-white">
                    Canal direto para vagas, propostas e contato profissional
                  </p>
                  <p class="mt-1 text-sm leading-6 text-slate-400">gilvanoliveira06@gmail.com</p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </div>
            </a>

            <a
              href="#"
              title="Cal.com"
              data-cal-namespace="consulta-agendada"
              data-cal-link="gilvanpoliveira/reuniao-agendada"
              data-cal-config='{"layout":"month_view"}'
              class="group block rounded-2xl border border-cyan-400/20 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-400/10"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-white">Agende uma reunião comigo</p>
                  <p class="mt-3 text-sm leading-6 text-slate-400">
                    Agendamento rápido para conversa ou alinhamento de ideias.
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </aside>
    </section>
  </MatrixShell>
</template>
