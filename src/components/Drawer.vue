<script lang="ts" setup>
import { onBeforeUnmount, watchEffect } from 'vue'
import { NDrawer, NDrawerContent } from 'naive-ui'
import { useWindowSize } from '@vueuse/core'
import { useStore } from '../composables/useStore';
  
const { width: windowWidth } = useWindowSize()
const { store } = useStore()
store.drawerWidth = Math.max(300, windowWidth.value / 3)
 watchEffect(() => {
    if (store.drawerWidth > windowWidth.value - 20) {
        store.drawerWidth = windowWidth.value - 20
    }
    store.openDrawer
        ? document.body.style.marginRight = `${store.drawerWidth}px`
        : document.body.style.marginRight = "0px"
 })

onBeforeUnmount(() => {
    document.body.style.marginRight = "0px"
})
</script>

<template>
    <button @click="store.openDrawer = !store.openDrawer">
        More
    </button>
    <NDrawer
        v-model:show="store.openDrawer"
        :width="store.drawerWidth"
        placement="right"
        :show-mask="false"
        :mask-closable="false"
        resizable
        :trap-focus="false"
        :on-update-width="w => store.drawerWidth = w"
    >
      <NDrawerContent title="Content editor" closable>
        Here is your content
      </NDrawerContent>
    </NDrawer>
</template>

<style>
body {
    transition: margin-right 0.3s;
}
</style>