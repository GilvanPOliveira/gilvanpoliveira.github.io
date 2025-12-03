<script setup lang="ts">
import { profile } from '../../data/profile'

const highlights = [
  'Tecnólogo em Desenvolvimento Fullstack',
  'Bacharel em Engenharia Civil',
  'Instituto Vai na Web',
  'Origamid',
]
</script>

<template>
  <section id="about" class="scroll-mt-24 py-10 md:py-10 bg-slate-950/60 text-slate-100">
    <div class="max-w-5xl mx-auto px-6 space-y-6">
      <header class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Sobre</p>
        <h2 class="text-2xl md:text-3xl font-bold">Quem é o {{ profile.name }} ?</h2>
      </header>

      <div class="space-y-4 text-sm md:text-base text-slate-300">
        <p>
          {{ profile.shortBio }}
        </p>
        <p class="text-slate-200">
          Sou desenvolvedor full stack e engenheiro civil, apaixonado por resolver problemas de
          forma estruturada, seja em código, seja em projetos do mundo real. Nos últimos anos, venho
          consolidando uma base sólida em desenvolvimento web por meio de cursos como Origamid,
          Instituto Vai na Web e o programa de Desenvolvimento Full Stack da Estácio de Sá, sempre
          com foco em criar interfaces intuitivas, acessíveis e bem pensadas. No dia a dia, trabalho
          principalmente com JavaScript e TypeScript, construindo aplicações com Vue, React e
          Angular.
        </p>
        <p class="text-slate-200">
          Tenho experiência também com Node.js, Ionic, HTML, CSS/Sass, Python (Flask), SQL e MySQL,
          o que me permite transitar com facilidade entre front-end, back-end e integrações. Pelo
          meu background em engenharia, também atuo com ferramentas como Revit, AutoCAD, Civil 3D,
          SketchUp e Fusion 360, trazendo uma visão técnica e pragmática para planejamento e
          execução. Também tenho vivência com programação de firmware como configurar o Marlin na
          minha impressora 3D para refinar calibração e confiabilidade do equipamento ou ajustar um
          Raspiberry Pi ou ESP32 para automatização ou apenas testes.
        </p>
        <p class="text-slate-200">
          Gosto de enxergar meus projetos como um todo: arquitetura, experiência do usuário,
          utilidade, microinterações e como cada detalhe se conecta aos objetivos de negócio
          idealizado. Busco escrever código claro, consistente e sustentável, que facilite
          manutenção e evolução. Meu objetivo é entregar soluções que sejam agradáveis na tela,
          sólidas na base de código e confiáveis no longo prazo.
        </p>
      </div>

      <ul class="mt-4 space-y-2 text-sm text-slate-300">
        <li v-for="item in highlights" :key="item" class="flex gap-2">
          <span class="mt-[3px] h-[6px] w-[6px] rounded-full bg-emerald-400"></span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
