<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../composables/useStore'
import { ChevronRight20Regular } from '@vicons/fluent'
import { Block, useContent } from '@vue-content/core'

const { store } = useStore()
const { contentSource } = useContent()

const block = computed(() => store.activeBlock)
const fieldKeys = computed(() => 
    Object.keys(block.value?.fields ?? [])
        .filter(f => !f.startsWith('$'))
)

const pushBreadcrumb = (label: string, block: Block) => {
    store.breadcrumbs.push({ label, block })
    store.activeBlock = block
}
</script>

<template>

  <n-space vertical>
    <n-form v-if="block">
        <n-form-item v-for="key in fieldKeys" :path="key" :label="key">
            <n-input 
                v-if="block.fieldSettings[key]?.singleLine === false" 
                v-model:value="block.fields[key]"
                type="textarea"
                placeholder=""
            />
            <n-button 
                v-else-if="typeof block.fields[key] === 'object'" 
                class="full-width-button" 
                icon-placement="right"
                @click="pushBreadcrumb(key, block?.fields[key] as Block)"
            >
                {{ key }}
                <template #icon>
                    <ChevronRight20Regular />
                </template>
            </n-button>
            <n-input v-else v-model:value="block.fields[key]" type="text" />
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