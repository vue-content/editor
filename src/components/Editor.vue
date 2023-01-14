<script setup lang="ts">
const { editMode, enterEditMode, exitEditMode } = useVueContentEditor()
const fullscreen = ref(false)
const props = defineProps<{ 
  visible?: boolean
  bottom?: boolean
}>()

watch(() => props.visible, (visible, prev) => {
  if (props.bottom) {
    document.body.style.marginBottom = visible ? "3rem" : "";
  }
  else {
    document.body.style.marginTop = visible ? "3rem" : "";
  }
})
</script>

<template>
  <div id="editor-menu" :class="{ bottom: bottom, top: !bottom, fullscreen, visible }">
    <button v-if="editMode" @click="exitEditMode()">Cancel</button>
    <button v-else @click="enterEditMode()">Edit</button>
    <div id="ql-toolbar-container"></div>
    <button @click="fullscreen = !fullscreen">Fullscreen</button>
    <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>
  </div>
</template>

<style lang="scss">

body {
  transition: margin-top 0.3s, margin-bottom 0.3s;
}

#editor-menu {
  background: white;
  position: fixed;
  left: 0;
  right: 0;
  box-shadow: 0 0 13px #b6b6b6;
  height: 3rem;
  transition: height 0.3s, bottom 0.3s, top 0.3s;
  display: flex;

  &.fullscreen {
    height: 100vh;
  }

  &.bottom {
    bottom: -4rem;
    &.visible {
      bottom: 0;
    }
  }

  &.top {
    top: -4rem;
    &.visible {
      top: 0;
    }
  }
}

</style>
