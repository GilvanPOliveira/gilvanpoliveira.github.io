<script setup lang="ts">
import { ref } from 'vue'
import type { StackItem } from '../data/profile'

const props = defineProps<{
  items: StackItem[]
}>()

const failedIcons = ref<Record<string, boolean>>({})

function markAsFailed(label: string) {
  failedIcons.value[label] = true
}

function getIconUrl(icon: string) {
  return `https://skillicons.dev/icons?i=${icon}`
}

function shouldShowFallback(label: string) {
  return Boolean(failedIcons.value[label])
}

function getFallbackText(label: string) {
  const words = label
    .replace(/[^a-zA-Z0-9+#. ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length) {
    return '?'
  }

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase()
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2" role="list" aria-label="Stacks e ferramentas">
    <div
      v-for="item in props.items"
      :key="item.label"
      role="listitem"
      class="flex h-12 min-w-[44px] items-center"
      :title="item.label"
    >
      <img
        v-if="!shouldShowFallback(item.label)"
        :src="getIconUrl(item.icon)"
        :alt="item.label"
        class="h-12 w-12 object-contain"
        width="48"
        height="48"
        decoding="async"
        @error="markAsFailed(item.label)"
      />

      <span
        v-else
        class="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-cyan-400/20 via-violet-400/20 to-emerald-400/20 text-[10px] font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        :aria-label="item.label"
      >
        {{ getFallbackText(item.label) }}
      </span>
    </div>
  </div>
</template>
