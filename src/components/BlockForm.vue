<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../composables/useStore'
import { ChevronRight20Regular } from '@vicons/fluent'
import { Block, useContent } from '@vue-content/core'

const { store } = useStore()
const { contentSource } = useContent()

const block = computed(() => store.activeBlock)
const fieldKeys = computed(() =>
  Object.keys(block.value ?? []).filter(f => f !== '$blockMeta')
)

const pushBreadcrumb = async (parent: Block<unknown>, field: string) => {
  const block = await contentSource?.readBlock({
    field,
    parent
  })
  store.activeBlock = block
  store.breadcrumbs.push({ label: field, block })
}
</script>

<template>
  <n-space vertical>
    <n-form v-if="block">
      <n-form-item v-for="field in fieldKeys" :path="field" :label="field">
        <n-input
          v-if="block.$blockMeta.fieldSettings[field]?.singleLine === false"
          v-model:value="block[field]"
          type="textarea"
          placeholder=""
        />
        <n-button
          v-else-if="typeof block[field] === 'object'"
          class="full-width-button"
          icon-placement="right"
          @click="pushBreadcrumb(block, field)"
        >
          {{ field }}
          <template #icon>
            <ChevronRight20Regular />
          </template>
        </n-button>
        <n-input v-else v-model:value="block[field]" type="text" />
      </n-form-item>
    </n-form>
  </n-space>
</template>

<style scoped>
.full-width-button {
  width: 100%;
  justify-content: space-between;
}
</style>
