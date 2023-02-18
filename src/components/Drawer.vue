<script lang="ts" setup>
import { ref } from 'vue'
import { NDrawer, NDrawerContent } from 'naive-ui'
  
const openDrawer = ref(false)
</script>

<template>
    <button @click="openDrawer = !openDrawer">
        Edit
    </button>
    <n-drawer v-model:show="openDrawer" :width="502" placement="right">
      <n-drawer-content title="Stoner">
        Stoner is a 1965 novel by the American writer John Williams.
      </n-drawer-content>
    </n-drawer>
  </template>
  