import Quill from 'quill'
import { watchEffect } from 'vue'
import { useStore } from './useStore'
import { sanitize, replaceVariables, ContentSource } from '@vue-content/core'

const { store } = useStore()

const buttons = {
  h1: { header: 1 },
  h2: { header: 2 },
  h3: { header: 3 },
  h4: { header: 4 },
  h5: { header: 5 },
  h6: { header: 6 },
  b: 'bold',
  i: 'italic',
  u: 'underline',
  a: 'link',
  strike: 'strike',
  ol: { list: 'ordered' },
  ul: { list: 'bullet' },
  code: 'code-block',
  blockquote: 'blockquote'
}

const formats = {
  header: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  bold: ['b', 'strong'],
  italic: ['i', 'em'],
  strike: ['strike'],
  link: ['a', 'link'],
  underline: ['u'],

  code: ['code'],
  blockquote: ['blockquote'],
  list: ['ul', 'ol', 'li'],
  'code-block': ['code']
}

type Tag = keyof typeof buttons

const isTag = (tag: string): tag is Tag => buttons.hasOwnProperty(tag)

const generateToolbarOptions = (tags: string[]) => {
  return tags.filter(isTag).map(tag => buttons[tag])
}

const generateFormats = (tags: string[]): string[] => {
  return tags
    .map(tag =>
      Object.keys(formats).find(formatKey =>
        formats[formatKey as keyof typeof formats].includes(tag)
      )
    )
    .filter((format): format is string => !!format)
}

async function findClosestBlock(contentSource: ContentSource, el: HTMLElement) {
  const blockElement: HTMLElement | null = el.closest('[data-content-block]')
  const id = blockElement?.dataset.contentBlock
  const block = await contentSource?.readBlock({ id })
  return block
}

const setQuillBlock = (singleLine: boolean) => {
  const quillBlock = Quill.import('blots/block')
  quillBlock.tagName = singleLine ? 'SPAN' : 'P'
  Quill.register(quillBlock, true)
}

const toggleEventPropagation = (el: HTMLElement, enable: boolean) => {
  const events = [
    'click',
    'mousedown',
    'mouseover',
    'mouseup',
    'input',
    'change',
    'keyup',
    'keydown',
    'selectionchange'
  ]
  const handler = (e: Event) => {
    if (e.type === 'keyup') {
      e.preventDefault() // Prevent space to send click event
    }
    e.stopPropagation()
  }
  events.forEach(event =>
    enable
      ? el.removeEventListener(event, handler)
      : el.addEventListener(event, handler)
  )
}

export const useVueContentEditor = () => {
  const enterEditMode = async (
    contentSource: ContentSource,
    el: HTMLElement
  ) => {
    store.activeElement = el
    const field = store.activeElement?.dataset.contentField
    if (!store.activeElement || !field || !contentSource) {
      console.error('No active element or field', contentSource)
      return
    }
    store.editMode = true
    const block = await findClosestBlock(contentSource, store.activeElement)
    if (!block) {
      console.error('Found no parent block')
      return
    }
    const singleLine = block.$blockMeta.fieldSettings[field].singleLine
    setQuillBlock(singleLine)

    const tags = block.$blockMeta.fieldSettings[field].tags
    store.activeElement.innerHTML = sanitize(block[field], { tags })
    const editor = new Quill(store.activeElement, {
      theme: 'snow',
      modules: {
        toolbar: generateToolbarOptions(tags)
      },
      formats: generateFormats(tags)
    })
    toggleEventPropagation(
      document.querySelector('.ql-editor') as HTMLElement,
      false
    )
    const toolbar = editor.getModule('toolbar').container
    document.querySelector('#ql-toolbar-container')?.replaceChildren(toolbar)
  }

  const exitEditMode = async (saveChanges: boolean) => {
    const field = store.activeElement?.dataset.contentField
    if (!store.activeElement || !field || !store.editMode) {
      return
    }
    store.editMode = false
    const block = store.activeBlock
    if (!block) {
      console.error('Found no parent block')
      return
    }
    const editor = store.activeElement.querySelector<HTMLElement>('.ql-editor')
    if (!editor) {
      return
    }
    toggleEventPropagation(editor, true)
    const container = editor.querySelector('.ql-editor span') ?? editor
    const html = sanitize(container?.innerHTML ?? '', {
      tags: block.$blockMeta.fieldSettings[field].tags
    })
    if (saveChanges) {
      block[field] = html
      // contentSource?.updateBlock(block) // TODO!!
    }
    store.activeElement.innerHTML = replaceVariables(
      block[field],
      block.$blockMeta.fieldSettings[field].variables
    )
    store.activeElement.classList.remove('ql-container', 'ql-snow')
    document.querySelector('#ql-toolbar-container')?.replaceChildren()
    store.activeElement = undefined
  }

  watchEffect(() => {
    if (store.editMode && store.pickerActive) {
      exitEditMode(true)
    }
  })

  return {
    enterEditMode,
    exitEditMode,
    saveChanges: async () => exitEditMode(true),
    discardChanges: async () => exitEditMode(false)
  }
}
