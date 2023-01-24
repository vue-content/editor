import Quill from 'quill'
import { ref } from 'vue'
import { useStore } from './useStore'
import { sanitize, replaceVariables } from '@vue-content/core'

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

const isTag = (tag: string): tag is Tag =>  buttons.hasOwnProperty(tag)

const generateToolbarOptions = (tags: string[]) => {
    return tags
        .filter(isTag)
        .map(tag => buttons[tag])
}

const generateFormats = (tags: string[]): string[] => {
    return tags
        .map(tag => Object.keys(formats).find(formatKey => formats[formatKey as keyof typeof formats].includes(tag)))
        .filter((format): format is string => !!format)
}

const findClosestBlock = (el: HTMLElement) => {
    const blockElement: HTMLElement | null = el.closest("[data-content-block]")
    const id = blockElement?.dataset.contentBlock
    // console.log(id)
    const block = store.contentSource?.readBlock({ id })
    return block
}

const setQuillBlock = (singleLine: boolean) => {
    const quillBlock = Quill.import('blots/block')
    quillBlock.tagName = singleLine ? 'SPAN' : 'P'
    Quill.register(quillBlock, true)
}

export const useVueContentEditor = () => {
    const enterEditMode = () => {
        const field = store.activeElement?.dataset.contentField
        if (!store.activeElement || !field || !store.contentSource) {
            console.error("No active element or field")
            return
        }
        store.editMode = true
        const block = findClosestBlock(store.activeElement)
        if (!block) {
            console.error("Found no parent block")
            return
        }
        const singleLine = block.fieldSettings[field].singleLine
        setQuillBlock(singleLine)

        const tags = block.fieldSettings[field].tags
        store.activeElement.innerHTML = sanitize(block.rawField(field), { tags })
        const editor = new Quill(store.activeElement, {
            theme: "snow",
            modules: {
                toolbar: generateToolbarOptions(tags)
            },
            formats: generateFormats(tags)
        })
        const toolbar = editor.getModule("toolbar").container
        document.querySelector("#ql-toolbar-container")?.append(toolbar)
    }

    const exitEditMode = () => {
        const field = store.activeElement?.dataset.contentField
        if (!store.activeElement || !field || !store.editMode) {
            return
        }
        store.editMode = false
        const block = findClosestBlock(store.activeElement)
        if (!block) {
            console.error("Found no parent block")
            return
        }
        const container = store.activeElement.querySelector(".ql-editor span") ?? store.activeElement.querySelector(".ql-editor")
        const html = sanitize(container?.innerHTML ?? '', { tags: block.fieldSettings[field].tags })
        block.setField(field, html)
        store.contentSource?.updateBlock(block)
        store.activeElement.innerHTML = replaceVariables(html, block.fieldSettings[field].variables)
        store.activeElement.classList.remove("ql-container", "ql-snow")
        const toolbarContainer = document.querySelector("#ql-toolbar-container")
        if (toolbarContainer) {
            toolbarContainer.innerHTML = ""
        }
    }

    const editMode = ref(false)
    return {
        editMode,
        enterEditMode,
        exitEditMode
    }
}