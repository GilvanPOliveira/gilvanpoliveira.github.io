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
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center">
    <div
      v-for="item in props.items"
      :key="item.label"
      class="flex h-12 min-w-[44px] items-center"
      :title="item.label"
    >
      <img
        v-if="!shouldShowFallback(item.label)"
        :src="getIconUrl(item.icon)"
        :alt="item.label"
        class="h-12 w-12 object-contain"
        loading="lazy"
        @error="markAsFailed(item.label)"
      />
 
      <span
        v-else
        class="text-xs text-slate-300"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
