<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from '../composables/useStore'
import { ChevronRight20Regular } from '@vicons/fluent'
import {
  implementsLocalizedContentSource,
  Block,
  UntypedBlock,
  useContent
} from '@vue-content/core'
import { useHighlighter } from '../composables/useHighlighter'
import { NSpace, NForm, NFormItem, NButton, NInput } from 'naive-ui'

const { store } = useStore()
const { contentSource } = useContent()

const block = computed<UntypedBlock | undefined>(() => store.activeBlock)
const fieldKeys = computed(() =>
  Object.keys(block.value ?? []).filter(f => f !== '$blockMeta')
)

const { highlightedField } = useHighlighter(block)

const pushBreadcrumb = async (parent: Block<unknown>, field: string) => {
  const block = await contentSource?.readBlock({
    field,
    parent
  })
  store.activeBlock = block
  store.breadcrumbs.push({ label: field, block })
}

if (implementsLocalizedContentSource(contentSource)) {
  watch(
    contentSource.localeRef,
    async () =>
      (store.activeBlock = await contentSource?.readBlock({
        id: block.value?.$blockMeta.id
      }))
  )
}
</script>

<template>
  <n-space vertical>
    <n-form v-if="block" class="content-block-form">
      <n-form-item v-for="field in fieldKeys" :path="field" :label="field">
        <n-input
          v-if="block.$blockMeta.fieldSettings[field]?.singleLine === false"
          v-model:value="block[field]"
          type="textarea"
          :data-content-field-input="field"
          placeholder=""
          @focus="highlightedField = field"
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
        <n-input
          v-else
          v-model:value="block[field]"
          type="text"
          :data-content-field-input="field"
          @focus="highlightedField = field"
        />
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

<style lang="scss">
.vue-content-highlight {
  box-shadow: 0 0 20px #12345678;
  transition: box-shadow 0.3s;
  &[data-content-field] {
    box-shadow: 0 0 20px #123456;
  }
}
</style>
