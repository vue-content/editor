<script setup lang="ts">
import { ref, onMounted, inject, onUnmounted } from 'vue'
import Toolbar from './Toolbar.vue'
import { useStore } from '../composables/useStore'
import { useVueContentEditor } from '../composables/useVueContentEditor'
import { useResizeObserver } from '@vueuse/core'

const editButtonTop = ref('0')
const editButtonLeft = ref('0')
const { store } = useStore()
store.contentSource = inject('content-source')
const editableSelector = '[data-content-block], [data-content-field]'

const { exitEditMode } = useVueContentEditor()

const moveToolbar = (el: HTMLElement) => {
  const boundaries = el.getBoundingClientRect()
  const bodyBoundaries = document.body.getBoundingClientRect()
  editButtonTop.value = `${boundaries.top - bodyBoundaries.top - 43}px`
  editButtonLeft.value = `${boundaries.left - bodyBoundaries.left}px`
}

const mouseOverHandler = (e: Event) => {
  if ((e as MouseEvent).shiftKey || store.editMode) {
    return
  }
  store.activeElement = (e.target as HTMLElement).closest(
    editableSelector
  ) as HTMLElement
  if (!store.activeElement) {
    return
  }
  e.stopPropagation()
  document
    .querySelectorAll('.vue-content-hovered')
    .forEach(hov => hov.classList.remove('vue-content-hovered'))
  store.activeElement.classList.add('vue-content-hovered')
  moveToolbar(store.activeElement)
  useResizeObserver(
    store.activeElement,
    () => store.activeElement !== undefined && moveToolbar(store.activeElement)
  )
  window?.addEventListener(
    'resize',
    () => store.activeElement !== undefined && moveToolbar(store.activeElement)
  )
}

onMounted(() => {
  document.body.style.position = 'relative'
  document.querySelectorAll(editableSelector).forEach(el => {
    el.addEventListener('mouseover', mouseOverHandler)
  })
})

onUnmounted(() => {
  document.querySelectorAll(editableSelector).forEach(el => {
    el.removeEventListener('mouseover', mouseOverHandler)
  })
  document
    .querySelectorAll('.vue-content-hovered')
    .forEach(hov => hov.classList.remove('vue-content-hovered'))
  exitEditMode(true)
  store.activeElement = undefined
})
</script>

<template>
  <Toolbar :y="editButtonTop" :x="editButtonLeft"></Toolbar>
</template>

<style lang="scss">
.vue-content-hovered {
  box-shadow: 0 0 20px #123456;
  transition: box-shadow 0.3s;
}
</style>
