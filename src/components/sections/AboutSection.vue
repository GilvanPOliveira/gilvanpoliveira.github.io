<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../../data/profile'

const highlights = [
  'Tecnólogo em Desenvolvimento Fullstack',
  'Bacharel em Engenharia Civil',
  'Instituto Vai na Web',
  'Origamid',
]

const showFullBio = ref(false)

const aboutTldr =
  'Desenvolvedor full stack e engenheiro civil com experiência em frontend (Vue, React, Angular) e backend (Python, REST APIs, MySQL/SQL). Atuo do design à infraestrutura, com foco em interfaces acessíveis, código sustentável e visão sistêmica. Explorando integração com hardware (impressoras 3D, Raspberry Pi, ESP32) e aplica raciocínio técnico de engenharia no desenvolvimento de soluções completas e bem estruturadas.'
</script>

<template>
  <section id="about" class="scroll-mt-24 py-10 md:py-10 bg-slate-950/60 text-slate-100">
    <div class="max-w-5xl mx-auto px-6 space-y-6">
      <header class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
          Sobre
        </p>
        <h2 class="text-2xl md:text-3xl font-bold">
          Quem é o {{ profile.name }} ?
        </h2>
      </header>

      <div class="space-y-6 text-sm md:text-base text-slate-300">
        <p class="text-slate-200">
          {{ aboutTldr }}
        </p>

        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 hover:text-emerald-200 transition"
          @click="showFullBio = !showFullBio"
        >
          <span v-if="!showFullBio">Descrição completa (Vizualizar)</span>
          <span v-else>Descrição completa (Ocultar)</span>

          <svg
            class="h-3 w-3 transition-transform"
            :class="showFullBio ? 'rotate-180' : ''"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
            />
          </svg>
        </button>

        <div
          v-if="showFullBio"
          class="space-y-4 pt-0 text-slate-200 text-sm md:text-base"
        >
          <p>
            Sou desenvolvedor full stack e engenheiro civil, apaixonado por resolver problemas de
            forma estruturada, seja em código, seja em projetos físicos. Nos últimos anos
            venho consolidando uma base sólida em desenvolvimento web com trilhas como Origamid, ciclos Frontend e Full Stack do
            Instituto Vai na Web e com o curso Tecnólogo em Desenvolvimento Full Stack da Estácio de Sá, sempre
            com foco em criar interfaces intuitivas, acessíveis e bem pensadas. No dia a dia,
            trabalho principalmente com JavaScript e TypeScript, construindo aplicações com Vue,
            React e Angular.
          </p>

          <p>
            Além do frontend, atuo também no backend com python, APIs REST, integração com
            serviços externos e bancos relacionais como MySQL e SQL em geral. Tenho experiência com
            HTML, CSS/Sass, Python (Flask) e ferramentas de build e deploy, o que me permite
            transitar com segurança entre camadas da aplicação. Pelo meu background em engenharia,
            também trabalho com Revit, AutoCAD, Civil 3D, SketchUp e Fusion 360, trazendo uma visão
            técnica e pragmática para planejamento, modelagem e execução.
          </p>

          <p>
            Gosto de ir além do “software tradicional” e colocar a mão no hardware como ajustes em firmware (Marlin) da minha impressora 3D para melhorar
            calibração, segurança e confiabilidade, além de experimentar automações com Raspberry Pi
            e ESP32 para testes, monitoramento e protótipos. Essa combinação de camadas, do
            firmware à interface, me ajuda a enxergar sistemas de forma completa.
          </p>

          <p>
            Costumo olhar para cada projeto como um conjunto de peças que precisam se encaixar bem:
            arquitetura, experiência do usuário, performance, microinterações (utilidades) e objetivos de
            negócio. Busco escrever código claro, consistente e sustentável, que facilite manutenção
            e evolução. Meu objetivo é entregar soluções que sejam agradáveis na tela, sólidas na
            base de código e confiáveis no longo prazo.
          </p>
        </div>
      </div>

      <ul class="mt-4 space-y-2 text-sm leading-5 text-slate-300">
        <li v-for="item in highlights" :key="item" class="flex items-start gap-2">
          <span class="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-emerald-400"></span>
          <span class="leading-5">{{ item }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
