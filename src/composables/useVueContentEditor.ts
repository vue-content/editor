import { generate } from '@vue/compiler-core'
import Quill from 'quill'
import { inject, ref } from 'vue'
import { useStore } from './useStore'

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

const generateToolbarOptions = (tags: Tag[]) => {
    return tags.map(tag => buttons[tag])
}

const generateFormats = (tags: Tag[]): string[] => {
    return tags
        .map(tag => Object.keys(formats).find(formatKey => formats[formatKey as keyof typeof formats].includes(tag)))
        .filter((format): format is string => !!format)
}
const isSingleLine = () => store.activeElement?.tagName !== "DIV" // TODO: make configurable

export const useVueContentEditor = () => {
    const enterEditMode = () => {
        if (!store.activeElement) {
            return
        }
        store.editMode = true

        const Block = Quill.import('blots/block')
        Block.tagName = isSingleLine() ? 'SPAN' : 'P'
        Quill.register(Block, true)

        const editor = new Quill(store.activeElement, {
            theme: "snow",
            modules: {
                // toolbar: generateToolbarOptions(tags as Tag[])
            },
            // formats: generateFormats(tags as Tag[])
        })
        const toolbar = editor.getModule("toolbar").container
        // toolbar.style.display = "none"
        document.querySelector("#ql-toolbar-container")?.append(toolbar)
        // editor.on("selection-change", () => toolbar.style.display = editor.hasFocus() ? "block" : "none")
    }

    const exitEditMode = () => {
        store.editMode = false
        if (!store.activeElement) {
            return
        }
        const selector = isSingleLine() ? ".ql-editor span" : ".ql-editor"
        const html = store.activeElement.querySelector(selector)?.innerHTML ?? ''
        store.activeElement.innerHTML = html
        store.activeElement.classList.remove("ql-container", "ql-snow")
        document.querySelector("#ql-toolbar-container")!.innerHTML = ""
    }

    const editMode = ref(false)
    return {
        editMode,
        enterEditMode,
        exitEditMode
    }
}