<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getScrollBehavior } from '../utils/motion'

const scrollY = ref(0)
let scrollFrame = 0

const handleScroll = () => {
  if (scrollFrame) {
    return
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    scrollY.value = window.scrollY
  })
}

const isVisible = computed(() => scrollY.value > 360)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: getScrollBehavior(),
  })
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
  }
})
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top-button"
      aria-label="Voltar ao topo"
      @click="scrollToTop"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="back-to-top-icon"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(34, 211, 238, 0.35);
  border-radius: 9999px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.96));
  color: rgb(103, 232, 249);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    0 0 18px rgba(34, 211, 238, 0.16);
  backdrop-filter: blur(8px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.back-to-top-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.back-to-top-button:hover {
  transform: translateY(-2px);
  border-color: rgba(34, 211, 238, 0.6);
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.42),
    0 0 24px rgba(34, 211, 238, 0.22);
}

.back-to-top-button:active {
  transform: translateY(0);
}

.back-to-top-button:focus-visible {
  outline: 2px solid rgba(103, 232, 249, 0.9);
  outline-offset: 3px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 0.24s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.92);
}

@media (max-width: 640px) {
  .back-to-top-button {
    right: 0.875rem;
    bottom: 0.875rem;
    width: 2.75rem;
    height: 2.75rem;
  }
}
</style>
