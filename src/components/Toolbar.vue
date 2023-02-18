<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import { ref, Teleport } from 'vue'
import { useStore } from '../composables/useStore'
import { useVueContentEditor } from '../composables/useVueContentEditor';
import Drawer from './Drawer.vue';

const editButton = ref(null)
const { store } = useStore()

const props = defineProps<{ 
    x: string
    y: string
}>()

const { enterEditMode, exitEditMode } = useVueContentEditor()
const toggleEditMode = () => {
  store.editMode
    ? exitEditMode()
    : enterEditMode()
}

</script>

<template>
  <Teleport to="body">
    <div id="vue-content-toolbar">
      <NConfigProvider preflight-style-disabled>
        <button ref="editButton" class="edit-button" @click="toggleEditMode">Edit</button>
        <div id="ql-toolbar-container"></div>
        <Drawer />
      </NConfigProvider>
    </div>
  </Teleport>
</template>

<style>
@import "../assets/quill.snow.css";

#vue-content-toolbar {
  display: flex;
  background: white;
  box-shadow: 0 0 5px #123456ae;
  position: absolute;
  left: v-bind(x);
  top: v-bind(y);
  transition: top 0.3s, left 0.3s, opacity 0.3s;
}

</style>