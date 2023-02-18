<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { NDrawer, NDrawerContent } from 'naive-ui'
  
const openDrawer = ref(false)
const width = ref(300)
 watchEffect(() => {
    openDrawer.value
        ? document.body.style.marginRight = `${width.value}px`
        : document.body.style.marginRight = "0px"
 })

</script>

<template>
    <button @click="openDrawer = !openDrawer">
        More
    </button>
    <NDrawer v-model:show="openDrawer" :width="width" placement="right" :show-mask="false" :mask-closable="false" resizable :on-update-width="w => width = w">
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