<script setup>

import { SelectAllOff24Regular, SelectAllOn24Regular } from '@vicons/fluent'
import { useStore } from '../composables/useStore.ts'

const { store } = useStore()

</script>


<template>
    <n-space>
        <n-button text @click="store.highlightActive = !store.highlightActive">
            <n-icon size="medium">
                <SelectAllOn24Regular v-if="store.highlightActive"/>
                <SelectAllOff24Regular v-else />
            </n-icon>
        </n-button>
    </n-space>
</template>