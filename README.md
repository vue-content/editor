# @vue-content/editor

This is the live editor that makes content intractable. Logged in users can hover a block or field and click edit to make changes to the content.

# Getting started

Before installing the editor, please make sure that the content source you're using is supporting edit mode. 

First you need to install the editor package in your project with the following command. Of cource `yarn` or any other package manager should work too.

    npm i @vue-content/editor

Somewhere in your codebase, place the following snippet to lazy load the editor, meaning that nothing will be added to your bundle or imported on page load for the majority of users. In this simple example you only need to click a button to activate the editor but of course you can get creative here. Maybe the editor should be triggered by a keyboard shortcut instead? Or a query parameter? Or when entering a specific value in a certain field. You decide where to draw the line between "hidden for average users but easy to find for editors". 

```vue
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const ContentEditor = defineAsyncComponent(async () => {
  await import('@vue-content/editor/style.css')
  const ContentEditor = await import('@vue-content/editor')
  return ContentEditor
})

const editMode = ref(false)
</script>

<template>
  <button @click="editMode = !editMode">Toggle edit mode</button>
  <ContentEditor v-if="editMode"></ContentEditor>
</template>
```

# Development

Run `npm i && npm run dev` to start the local development server. The code that is used for the sample site is located in src/sample. 