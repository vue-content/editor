<script setup lang="ts">
import {
  SelectAllOff24Regular,
  SelectAllOn24Regular,
  MyLocation24Regular
} from '@vicons/fluent'
import { useStore } from '../composables/useStore'
import { usePicker } from '../composables/usePicker'

const { store } = useStore()
usePicker()
</script>

<template>
  <n-space>
    <n-button text @click="store.highlightActive = !store.highlightActive">
      <n-icon size="medium">
        <SelectAllOn24Regular v-if="store.highlightActive" />
        <SelectAllOff24Regular v-else />
      </n-icon>
    </n-button>
    <n-button text @click="store.pickerActive = !store.pickerActive">
      <n-icon size="medium">
        <MyLocation24Regular />
      </n-icon>
    </n-button>
  </n-space>
</template>
