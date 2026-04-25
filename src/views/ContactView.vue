<script setup lang="ts">
import MatrixShell from '../components/MatrixShell.vue'
import { siteConfig } from '../data/site'

const calLink = 'gilvanpoliveira/reuniao-agendada'
const calConfig = {
  layout: 'month_view',
  theme: 'dark',
}
const calendarButtonClass =
  'inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-400/20 max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:text-xs sm:w-auto'
let calEmbedPromise: Promise<void> | null = null

type CalCommand = ((command: string, ...args: unknown[]) => void) & { q?: unknown[] }

declare global {
  interface Window {
    Cal?: CalCommand & {
      loaded?: boolean
      ns?: Record<string, CalCommand>
      q?: unknown[]
    }
  }
}

function createCalStub() {
  if (window.Cal) {
    return
  }

  const cal = ((command: string, ...args: unknown[]) => {
    const currentCal = window.Cal

    if (!currentCal) {
      return
    }

    currentCal.q = currentCal.q || []

    if (command === 'init') {
      const namespace = args[0]
      const namespaceQueue = ((...namespaceArgs: unknown[]) => {
        namespaceQueue.q = namespaceQueue.q || []
        namespaceQueue.q.push(namespaceArgs)
      }) as CalCommand & { q?: unknown[] }

      if (typeof namespace === 'string') {
        currentCal.ns = currentCal.ns || {}
        currentCal.ns[namespace] = currentCal.ns[namespace] || namespaceQueue
        currentCal.ns[namespace].q = currentCal.ns[namespace].q || []
        currentCal.ns[namespace].q?.push([command, ...args])
        currentCal.q.push(['initNamespace', namespace])
      } else {
        currentCal.q.push([command, ...args])
      }

      return
    }

    currentCal.q.push([command, ...args])
  }) as NonNullable<Window['Cal']>

  cal.loaded = false
  cal.ns = {}
  cal.q = []
  window.Cal = cal
}

function loadCalEmbed() {
  if (calEmbedPromise) {
    return calEmbedPromise
  }

  calEmbedPromise = new Promise((resolve, reject) => {
    createCalStub()

    if (window.Cal?.loaded) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    script.onload = () => {
      window.Cal?.('init', 'reuniao-agendada', { origin: 'https://cal.com' })
      window.Cal?.ns?.['reuniao-agendada']?.('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
      resolve()
    }
    script.onerror = () => reject(new Error('Falha ao carregar o agendamento.'))
    document.head.appendChild(script)
    window.Cal!.loaded = true
  })

  return calEmbedPromise
}

async function openCalendar() {
  try {
    await loadCalEmbed()
    window.Cal?.ns?.['reuniao-agendada']?.('modal', {
      calLink,
      config: calConfig,
    })
  } catch {
    window.open(siteConfig.calendarUrl, '_blank', 'noopener,noreferrer')
  }
}

const primaryActions = [
  {
    label: 'GitHub',
    href: siteConfig.githubUrl,
    rel: 'me noopener noreferrer',
    target: '_blank',
    className:
      'inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-white max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:text-xs sm:w-auto',
  },
  {
    label: 'LinkedIn',
    href: siteConfig.linkedinUrl,
    rel: 'me noopener noreferrer',
    target: '_blank',
    className:
      'inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:text-xs sm:w-auto',
  },
  {
    label: 'Email',
    href: `mailto:${siteConfig.email}`,
    rel: undefined,
    target: undefined,
    className:
      'inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-white max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:text-xs sm:w-auto',
  },
] as const
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 max-[350px]:gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article
        class="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] max-[350px]:rounded-[18px] max-[350px]:p-4 sm:p-6 xl:h-[560px] xl:overflow-hidden"
      >
        <div class="flex h-full flex-col">
          <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80 max-[350px]:text-[11px] max-[350px]:tracking-[0.22em]">
            Contato
          </p>

          <h1 class="mt-4 text-2xl font-semibold text-white max-[350px]:text-xl sm:text-3xl lg:text-4xl">
            Vamos conversar
          </h1>

          <div
            class="overflow-visible py-2 pr-0 text-justify sm:pr-2 xl:flex-1 xl:overflow-y-auto xl:pr-4"
          >
            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 max-[350px]:text-left max-[350px]:leading-6 sm:text-base">
              Se você chegou até aqui, provavelmente quer conhecer melhor meu trabalho, conversar
              sobre oportunidades ou trocar ideias sobre produtos e tecnologia. Mantive esta página
              objetiva para que o contato seja rápido, claro e direto.
            </p>

            <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 max-[350px]:text-left max-[350px]:leading-6 sm:text-base">
              Você pode falar comigo por email, acompanhar meu histórico técnico no GitHub, conectar
              pelo LinkedIn ou abrir uma conversa já com horário marcado. O canal ideal depende do
              contexto, mas todos eles estão prontos para uso.
            </p>

          </div>

          <section class="mt-8 max-[350px]:mt-6 xl:mt-auto" aria-labelledby="contato-rapido-title">
            <h2
              id="contato-rapido-title"
              class="mb-3 text-xs uppercase tracking-[0.3em] text-violet-300/80 max-[350px]:tracking-[0.18em]"
            >
              Acesso rápido
            </h2>

            <div class="grid gap-3 max-[350px]:gap-2 sm:flex sm:flex-wrap">
              <a
                v-for="action in primaryActions"
                :key="action.label"
                :href="action.href"
                :target="action.target"
                :rel="action.rel"
                :class="action.className"
              >
                {{ action.label }}
              </a>

              <button
                type="button"
                :class="calendarButtonClass"
                @click="openCalendar"
              >
                Agende uma conversa
              </button>
            </div>
          </section>
        </div>
      </article>

      <aside class="grid gap-6 max-[350px]:gap-4 md:grid-cols-2 xl:grid-cols-1">
        <section
          aria-labelledby="redes-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 max-[350px]:rounded-[18px] max-[350px]:p-4 xl:h-[265px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <h2
              id="redes-title"
              class="text-center text-xs uppercase tracking-[0.3em] text-emerald-300/80 max-[350px]:tracking-[0.18em]"
            >
              Minhas redes
            </h2>

            <div class="mt-5 space-y-4 max-[350px]:mt-4 max-[350px]:space-y-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-1">
              <a
                :href="siteConfig.githubUrl"
                target="_blank"
                rel="me noopener noreferrer"
                class="group block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10 max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:py-3"
              >
                <div class="flex items-start justify-between gap-3 max-[350px]:gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white max-[350px]:text-[13px]">
                      Repositórios, laboratórios e histórico técnico
                    </p>
                    <p class="mt-1 break-words text-sm leading-6 text-slate-400 max-[350px]:text-xs max-[350px]:leading-5">
                      github.com/GilvanPOliveira
                    </p>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="h-4 w-4 shrink-0 max-[350px]:h-3.5 max-[350px]:w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.724.5.096.682-.223.682-.496 0-.245-.009-.894-.014-1.754-2.782.621-3.37-1.37-3.37-1.37-.455-1.183-1.11-1.498-1.11-1.498-.908-.638.069-.625.069-.625 1.003.072 1.53 1.053 1.53 1.053.892 1.565 2.341 1.113 2.91.851.091-.665.349-1.113.635-1.369-2.22-.259-4.555-1.137-4.555-5.06 0-1.118.389-2.033 1.026-2.75-.103-.26-.445-1.302.097-2.714 0 0 .838-.276 2.747 1.05A9.303 9.303 0 0 1 12 6.93c.85.004 1.705.117 2.504.345 1.908-1.326 2.744-1.05 2.744-1.05.544 1.412.202 2.454.1 2.714.639.717 1.024 1.632 1.024 2.75 0 3.932-2.338 4.798-4.566 5.052.359.317.679.941.679 1.897 0 1.37-.012 2.475-.012 2.812 0 .276.18.597.688.495A10.264 10.264 0 0 0 22 12.25C22 6.59 17.523 2 12 2Z"
                    />
                  </svg>
                </div>
              </a>

              <a
                :href="siteConfig.linkedinUrl"
                target="_blank"
                rel="me noopener noreferrer"
                class="group block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-400/10 max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:py-3"
              >
                <div class="flex items-start justify-between gap-3 max-[350px]:gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white max-[350px]:text-[13px]">Perfil profissional e networking</p>
                    <p class="mt-1 break-words text-sm leading-6 text-slate-400 max-[350px]:text-xs max-[350px]:leading-5">
                      linkedin.com/in/gilvanpoliveira
                    </p>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="h-4 w-4 shrink-0 max-[350px]:h-3.5 max-[350px]:w-3.5"
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
        </section>

        <section
          aria-labelledby="contato-direto-title"
          class="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5 max-[350px]:rounded-[18px] max-[350px]:p-4 xl:h-[265px] xl:overflow-hidden"
        >
          <div class="flex h-full flex-col">
            <div class="space-y-3 max-[350px]:mt-4 max-[350px]:space-y-3 xl:min-h-0 xl:flex-1 xl:pr-1">
              <a
                :href="`mailto:${siteConfig.email}`"
                class="group block rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10 max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:py-3"
              >
                <div class="flex items-start justify-between gap-3 max-[350px]:gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white max-[350px]:text-[13px]">
                      Canal direto para vagas, propostas e contato profissional
                    </p>
                    <p class="mt-1 break-words text-sm text-slate-400 max-[350px]:text-xs max-[350px]:leading-5">
                      {{ siteConfig.email }}
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
                    class="h-4 w-4 shrink-0 max-[350px]:h-3.5 max-[350px]:w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </div>
              </a>

              <button
                type="button"
                class="group block w-full rounded-2xl border border-cyan-400/20 bg-black/20 px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-400/10 max-[350px]:rounded-xl max-[350px]:px-3 max-[350px]:py-3"
                @click="openCalendar"
              >
                <div class="flex items-start justify-between gap-3 max-[350px]:gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white max-[350px]:text-[13px]">Agende uma conversa comigo</p>
                    <p class="mt-2 text-sm text-slate-400 max-[350px]:mt-2 max-[350px]:text-xs max-[350px]:leading-5">
                      Link direto para marcar uma conversa rápida ou alinhamento de ideias.
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
                    class="h-4 w-4 shrink-0 max-[350px]:h-3.5 max-[350px]:w-3.5"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </MatrixShell>
</template>
