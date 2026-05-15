<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StackItem } from '../data/profile'
import { getSkillIconUrl, isSupportedSkillIcon, normalizeSkillIconId } from '../utils/skillIcons'

const props = defineProps<{
  items: StackItem[]
}>()

const failedIcons = ref<Record<string, boolean>>({})

const visibleItems = computed(() => {
  const seenIcons = new Set<string>()
  const seenLabels = new Set<string>()

  return props.items.filter((item) => {
    const icon = normalizeSkillIconId(item.icon)
    const label = item.label.toLowerCase().trim()

    if (
      failedIcons.value[item.label] ||
      !isSupportedSkillIcon(icon) ||
      seenIcons.has(icon) ||
      seenLabels.has(label)
    ) {
      return false
    }

    seenIcons.add(icon)
    seenLabels.add(label)
    return true
  })
})

function markAsFailed(label: string) {
  failedIcons.value[label] = true
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2" role="list" aria-label="Stacks e ferramentas">
    <div
      v-for="item in visibleItems"
      :key="item.label"
      role="listitem"
      class="flex h-12 min-w-[44px] items-center"
      :title="item.label"
    >
      <img
        :src="getSkillIconUrl(item.icon)"
        :alt="item.label"
        class="h-12 w-12 object-contain"
        width="48"
        height="48"
        decoding="async"
        @error="markAsFailed(item.label)"
      />
    </div>
  </div>
</template>
