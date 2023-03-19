<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { ref, Teleport, watchEffect } from 'vue'
import { useStore } from '../composables/useStore'
import { useVueContentEditor } from '../composables/useVueContentEditor'
import { Save24Filled, DismissCircle24Filled } from '@vicons/fluent'
import { NSpace, NIcon, NButton, NDivider } from 'naive-ui'

const { store } = useStore()

const toolbarX = ref('0')
const toolbarY = ref('0')
const toolbarWidth = ref('0')

const { saveChanges, discardChanges } = useVueContentEditor()

watchEffect(() => {
  if (!store.activeElement) {
    return
  }
  const elementBoundaries = useElementBounding(store.activeElement)
  const bodyBoundaries = useElementBounding(document.body)
  toolbarX.value = `${
    elementBoundaries.left.value - bodyBoundaries.left.value + store.drawerWidth
  }px`
  toolbarY.value = `${
    elementBoundaries.top.value - bodyBoundaries.top.value - 50
  }px`
  toolbarWidth.value = `${elementBoundaries.width.value}px`
})
</script>

<template>
  <Teleport to="body">
    <div
      id="vue-content-toolbar"
      v-if="store.activeElement && !store.pickerActive"
    >
      <n-space
        horizontal
        class="toolbar"
        align="center"
        justify="space-between"
      >
        <div id="ql-toolbar-container"></div>
        <n-space horizontal class="save-buttons">
          <n-button text @click="saveChanges">
            <n-icon size="20">
              <Save24Filled />
            </n-icon>
          </n-button>
          <n-button text @click="discardChanges">
            <n-icon size="20">
              <DismissCircle24Filled />
            </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </div>
  </Teleport>
</template>

<style>
@import '../assets/quill.snow.css';

#vue-content-toolbar {
  display: flex;
  background: white;
  box-shadow: 0 0 5px #123456ae;
  position: absolute;
  width: v-bind(toolbarWidth);
  height: 50px;
  left: v-bind(toolbarX);
  top: v-bind(toolbarY);
  /* transition: top 0.3s, left 0.3s, opacity 0.3s, width 0.3s; */
}

.toolbar {
  width: 100%;
}

.save-buttons {
  margin-right: 1em;
  margin-top: 0.5em;
}
</style>
