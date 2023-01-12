<script setup lang="ts">
import { ref, onMounted, Teleport } from 'vue';

const editButton = ref(null)
const editButtonTop = ref('0')
const editButtonLeft = ref('0')

const log = () => console.log(document.querySelector('.hovered'))

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
      const target = (e.target as HTMLElement).matches(editableSelector)
        ? e.target
        : findParentBlockElement(e.target as HTMLElement)
      if ((e as MouseEvent).shiftKey || !target) {
        return
      }
      e.stopPropagation()
      document.querySelectorAll(".hovered").forEach(hov => hov.classList.remove("hovered"));
      (target as HTMLElement).classList.add("hovered")
      const boundaries = (target as  HTMLElement).getBoundingClientRect()
      const bodyBoundaries = document.body.getBoundingClientRect()
      editButtonTop.value = `${boundaries.top - bodyBoundaries.top}px`
      editButtonLeft.value = `${boundaries.left - bodyBoundaries.left}px`
    })
  })
})
</script>

<template>
  <Teleport to="body">
    <button ref="editButton" class="edit-button" @click="log">Edit</button>
  </Teleport>
</template>

<style lang="scss">
.editable {
  padding: 3rem;
  background: rgba(0, 0, 0, 0.1);

}

.edit-button {
  position: absolute;
  top: v-bind(editButtonTop);
  left: v-bind(editButtonLeft);
  transition: top 0.3s, left 0.3s, opacity 0.3s;
}

.hovered {
  box-shadow: 0 0 20px #123456;
  transition: box-shadow 0.3s;
}

</style>
