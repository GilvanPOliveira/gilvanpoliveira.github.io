<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MatrixShell from '../components/MatrixShell.vue';
import StackStrip from '../components/StackStrip.vue';
import { useGitHubPortfolio } from '../composables/useGitHubPortfolio';
import { studyStackGroups } from '../data/profile';
import { siteConfig } from '../data/site';
import { fetchCertificates, type Certificate } from '../services/certificates';

const { stackSummary, loadStackSummary } = useGitHubPortfolio();
const certificates = ref<Certificate[]>([]);
const loadingCertificates = ref(false);
const showingCertificates = ref(false);
const selectedCertificateCategory = ref('Todos');

const studiedStackGroups = computed(() =>
  stackSummary.value?.studiedGroups.length ? stackSummary.value.studiedGroups : studyStackGroups
);

const certificateCategories = computed(() => [
  'Todos',
  ...Array.from(new Set(certificates.value.map((certificate) => certificate.category).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, 'pt-BR')
  ),
]);

const filteredCertificates = computed(() => {
  if (selectedCertificateCategory.value === 'Todos') {
    return certificates.value;
  }

  return certificates.value.filter(
    (certificate) => certificate.category === selectedCertificateCategory.value
  );
});

async function loadCertificates() {
  loadingCertificates.value = true;

  try {
    certificates.value = await fetchCertificates();
  } finally {
    loadingCertificates.value = false;
  }
}

function showCertificates() {
  showingCertificates.value = true;
}

function showAbout() {
  showingCertificates.value = false;
}

function getCertificateInitials(certificate: Certificate) {
  const source = certificate.issuer || certificate.category || certificate.title;

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

onMounted(async () => {
  void loadStackSummary();
  await loadCertificates();
});
</script>

<template>
  <MatrixShell>
    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div class="portfolio-flip-card xl:h-[560px]" :class="{ 'is-flipped': showingCertificates }">
        <article
          class="portfolio-flip-face rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
          :aria-hidden="showingCertificates"
        >
          <div class="flex h-full flex-col">
            <p class="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Trajetoria</p>

            <h1 class="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">Sobre mim</h1>

            <div
              class="overflow-visible py-2 pr-0 text-justify sm:pr-2 xl:flex-1 xl:overflow-y-auto xl:pr-4"
            >
              <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Sou {{ siteConfig.role }}, com foco na construcao de aplicacoes web completas, desde a
                modelagem de dados e definicao de regras de negocio ate a entrega de interfaces bem
                estruturadas no frontend. Trabalho com JavaScript, TypeScript e desenvolvimento de Web
                Apps em Vue, React e Angular, alem de APIs REST em Python com Flask e FastAPI.
              </p>

              <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Priorizo organizacao de codigo, separacao de responsabilidades e consistencia
                arquitetural para que o sistema permaneca previsivel, escalavel e simples de manter.
                Tambem dedico atencao a performance, acessibilidade e responsividade para garantir uma
                experiencia solida em diferentes contextos de uso.
              </p>

              <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Sou Pessoa com Deficiencia (PCD) e estou em busca de oportunidades que valorizem
                diversidade, colaboracao e evolucao continua. Quero contribuir com consistencia,
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

                <button
                  type="button"
                  class="inline-flex w-fit items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-400/20"
                  @click="showCertificates"
                >
                  Certificados
                </button>
              </div>
            </div>
          </div>
        </article>

        <article
          class="portfolio-flip-face portfolio-flip-back rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6 xl:h-[560px] xl:overflow-hidden"
          :aria-hidden="!showingCertificates"
        >
          <div class="flex h-full flex-col">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Certificacoes</p>
                <h2 class="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                  Certificados
                </h2>
              </div>

              <button
                type="button"
                class="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-white"
                @click="showAbout"
              >
                Voltar
              </button>
            </div>

            <div
              class="mt-6 overflow-visible pr-0 text-left sm:pr-2 xl:flex-1 xl:overflow-y-auto xl:pr-4"
              aria-live="polite"
            >
              <div v-if="loadingCertificates" class="text-sm text-slate-400" role="status">
                Carregando certificados...
              </div>

              <div
                v-else-if="!certificates.length"
                class="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-400"
              >
                Nenhum certificado publico foi encontrado no momento.
              </div>

              <div v-else class="grid gap-4">
                <div class="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar certificados">
                  <button
                    v-for="category in certificateCategories"
                    :key="category"
                    type="button"
                    class="rounded-xl border px-3 py-2 text-xs transition"
                    :class="
                      selectedCertificateCategory === category
                        ? 'border-emerald-400/40 bg-emerald-400/10 text-white'
                        : 'border-white/10 bg-black/20 text-slate-300 hover:border-violet-400/40 hover:bg-violet-400/10'
                    "
                    :aria-selected="selectedCertificateCategory === category"
                    role="tab"
                    @click="selectedCertificateCategory = category"
                  >
                    {{ category }}
                  </button>
                </div>

                <div class="grid gap-3">
                  <article
                    v-for="certificate in filteredCertificates"
                    :key="`${certificate.category}-${certificate.title}-${certificate.issuer}-${certificate.date}`"
                    class="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[150px_minmax(0,1fr)]"
                  >
                    <div class="certificate-preview" aria-hidden="true">
                      <div class="certificate-preview__seal">
                        {{ getCertificateInitials(certificate) }}
                      </div>
                      <div class="certificate-preview__lines">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="certificate-preview__ribbon"></div>
                    </div>

                    <div class="min-w-0">
                      <p class="text-sm font-medium text-white [overflow-wrap:anywhere]">
                        {{ certificate.title }}
                      </p>
                      <p v-if="certificate.issuer" class="mt-1 text-xs leading-5 text-slate-400">
                        {{ certificate.issuer }}
                      </p>

                      <div class="mt-3 flex flex-wrap gap-2">
                        <span class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-100">
                          {{ certificate.category }}
                        </span>

                        <span
                          v-if="certificate.date"
                          class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200"
                        >
                          {{ certificate.date }}
                        </span>

                        <span
                          v-if="certificate.workload"
                          class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200"
                        >
                          {{ certificate.workload }}
                        </span>

                        <span
                          v-for="tag in certificate.tags"
                          :key="tag"
                          class="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] text-violet-100"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

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
                  v-for="group in studiedStackGroups"
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
