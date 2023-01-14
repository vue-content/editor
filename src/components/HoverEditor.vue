<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Toolbar from './Toolbar.vue';
import { useStore } from '../composables/useStore'


const editButtonTop = ref('0')
const editButtonLeft = ref('0')
const { store } = useStore()

const findParentBlockElement = (el: HTMLElement): HTMLElement | undefined => {
  const parent = el.parentElement
  const id = el.dataset.contentBlock
  if (id) {
    return el
  }
  if (parent) {
    return findParentBlockElement(parent)
  }
}

const editableSelector = "[data-content-block], [data-content-html], [data-content-text]"

onMounted(() => {
  document.body.style.position = "relative";
  document.querySelectorAll(editableSelector).forEach(el => {
    el.addEventListener('mouseover', (e) => { 
      if ((e as MouseEvent).shiftKey || store.editMode) {
        return
      }
      store.activeElement = (e.target as HTMLElement).matches(editableSelector)
        ? e.target as HTMLElement
        : findParentBlockElement(e.target as HTMLElement)
      if (!store.activeElement) {
        return
      }
      e.stopPropagation()
      document.querySelectorAll(".hovered").forEach(hov => hov.classList.remove("hovered"));
      store.activeElement.classList.add("hovered")
      const boundaries = store.activeElement.getBoundingClientRect()
      const bodyBoundaries = document.body.getBoundingClientRect()
      editButtonTop.value = `${boundaries.top - bodyBoundaries.top - 43}px`
      editButtonLeft.value = `${boundaries.left - bodyBoundaries.left}px`
    })
  })
})
</script>

<template>
  <Toolbar :y="editButtonTop" :x="editButtonLeft"></Toolbar>
</template>

<style lang="scss">

.hovered {
  box-shadow: 0 0 20px #123456;
  transition: box-shadow 0.3s;
}

</style>
