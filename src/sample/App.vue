<script setup lang="ts">
import { computed, defineAsyncComponent, inject, ref } from 'vue';
import { LocalizedInMemorySource } from '@vue-content/core';
import { contentSource } from './content';

const ContentEditor = defineAsyncComponent(async () => {
  // await import('@vue-content/editor/style.css')
  const ContentEditor = await import('../components/ContentEditor.vue'); // This should be imported from '@vue-content/editor' in real apps
  return ContentEditor;
});

defineProps<{ msg: string }>();
const contentSource = inject<LocalizedInMemorySource>('content-source')!;

const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const editMode = ref(false);
</script>

<template>
  <ContentBlock>
    <h1 v-content-text:title></h1>

    <ContentBlock field="card" class="card">
      <button
        type="button"
        @click="count++"
        v-content-text:countResult
      ></button>
      <p v-content-html:editSample></p>
    </ContentBlock>

    <!-- <ContentList class="paragraph" field="paragraphs">
      <p v-content-html:value></p>
    </ContentList> -->
    <div v-content-html:moreInfo class="paragraphs"></div>
    <p v-content-text:currentLocale="{ locale: contentSource.locale }"></p>
  </ContentBlock>
  <div>
    <button
      v-for="locale in contentSource?.locales"
      @click="contentSource.locale = locale"
    >
      {{ locale }}
    </button>
  </div>
  <button @click="editMode = !editMode">Toggle edit mode</button>
  <ContentEditor v-if="editMode"></ContentEditor>
</template>

<style scoped>
@import './style.css';

.paragraph:last-of-type p {
  color: #888;
}
</style>
