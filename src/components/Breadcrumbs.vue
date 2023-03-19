<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from '../composables/useStore'
import { useContent } from '@vue-content/core'
import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui'

const { contentSource } = useContent()
const { store } = useStore()

const onClick = (index: number) => {
  store.breadcrumbs.splice(index + 1)
  store.activeBlock = store.breadcrumbs[index]?.block
}

onMounted(async () => {
  if (!store.activeBlock) {
    const block = await contentSource?.readBlock()
    if (block) {
      store.breadcrumbs.push({
        label: 'root',
        block
      })
      store.activeBlock = block
    }
  }
})
</script>

<template>
  <n-breadcrumb v-if="store.activeBlock">
    <n-breadcrumb-item
      v-for="(breadcrumb, i) in store.breadcrumbs"
      @click="onClick(i)"
    >
      {{ breadcrumb.label }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>
