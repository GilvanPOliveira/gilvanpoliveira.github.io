<script setup lang="ts">
import { RouterView } from 'vue-router'
import BackToTopButton from './components/BackToTopButton.vue'
</script>

<template>
  <a class="skip-link" href="#conteudo-principal">Pular para o conteúdo principal</a>
  <RouterView />
  <BackToTopButton />
</template>

<style scoped>
.skip-link {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 100;
  transform: translateY(-200%);
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.45);
  background: rgba(2, 6, 23, 0.96);
  color: #f8fafc;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.skip-link:focus-visible {
  transform: translateY(0);
  outline: 2px solid rgba(103, 232, 249, 0.95);
  outline-offset: 3px;
}
</style>
