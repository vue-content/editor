<script lang="ts" setup>
import { onBeforeUnmount, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useStore } from '../composables/useStore';
import BlockForm from './BlockForm.vue';
import Breadcrumbs from './Breadcrumbs.vue';

const { width: windowWidth } = useWindowSize();
const { store } = useStore();
store.drawerWidth = Math.max(300, windowWidth.value / 3);
watchEffect(() => {
  if (store.drawerWidth > windowWidth.value - 20) {
    store.drawerWidth = windowWidth.value - 20;
  }
  store.openDrawer
    ? (document.body.style.marginLeft = `${store.drawerWidth}px`)
    : (document.body.style.marginLeft = '0px');
});

onBeforeUnmount(() => {
  document.body.style.marginLeft = '0px';
});
</script>

<template>
  <button @click="store.openDrawer = !store.openDrawer">More</button>
  <n-drawer
    v-model:show="store.openDrawer"
    :width="store.drawerWidth"
    placement="left"
    :show-mask="false"
    :mask-closable="false"
    resizable
    :trap-focus="false"
    :block-scroll="false"
    :on-update-width="(w: number) => store.drawerWidth = w"
  >
    <n-drawer-content title="Content editor" closable>
      <Breadcrumbs />
      <n-divider />
      <BlockForm />
    </n-drawer-content>
  </n-drawer>
</template>

<style>
body {
  transition: margin-left 0.3s;
}
</style>
