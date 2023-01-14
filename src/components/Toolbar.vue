<script setup lang="ts">
import { inject, ref, Teleport } from 'vue'
import { useStore } from '../composables/useStore'

const editButton = ref(null)
const { store } = useStore()

const props = defineProps<{ 
    x: string
    y: string
}>()

const log = () => console.log(store.activeElement)
</script>

<template>
  <Teleport to="body">
    <button ref="editButton" class="edit-button" @click="log">Edit</button>
  </Teleport>
</template>

<style>

.edit-button {
  box-shadow: 0 0 5px #123456ae;
  position: absolute;
  left: v-bind(x);
  top: v-bind(y);
  transition: top 0.3s, left 0.3s, opacity 0.3s;
}

</style>