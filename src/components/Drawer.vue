<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useStore } from '../composables/useStore'
import BlockForm from './BlockForm.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import Options from './Options.vue'
import Toolbar from './Toolbar.vue'
import { NConfigProvider, NDrawer, NDrawerContent, NDivider } from 'naive-ui'

const { width: windowWidth } = useWindowSize()
const { store } = useStore()
store.drawerWidth = Math.max(300, windowWidth.value / 3)
const openDrawer = ref(false)
watchEffect(() => {
  if (store.drawerWidth > windowWidth.value - 20) {
    store.drawerWidth = windowWidth.value - 20
  }
  openDrawer
    ? (document.body.style.marginLeft = `${store.drawerWidth}px`)
    : (document.body.style.marginLeft = '0px')
})

onMounted(() => (openDrawer.value = true))
const emit = defineEmits(['close'])

const close = () => {
  openDrawer.value = false
  document.body.style.marginLeft = '0px'
  emit('close')
}

onBeforeUnmount(close)
</script>

<template>
  <n-config-provider preflight-style-disabled>
    <n-drawer
      v-model:show="openDrawer"
      :width="store.drawerWidth"
      placement="left"
      :show-mask="false"
      :mask-closable="false"
      resizable
      :trap-focus="false"
      :block-scroll="false"
      :on-update-width="(w: number) => store.drawerWidth = w"
      :on-after-leave="close"
    >
      <n-drawer-content title="Content editor" closable>
        <Options />
        <Breadcrumbs />
        <n-divider />
        <BlockForm />
        <Toolbar />
      </n-drawer-content>
    </n-drawer>
  </n-config-provider>
</template>

<style>
body {
  transition: margin-left 0.3s;
}
</style>
