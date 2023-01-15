import Quill from 'quill'
import { ref } from 'vue'
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
    console.log(id)
    const block = store.contentSource?.readBlock({ id })
    return block
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

        const quillBlock = Quill.import('blots/block')
        quillBlock.tagName = singleLine ? 'SPAN' : 'P'
        Quill.register(quillBlock, true)

        const tags = block.fieldSettings[field].tags
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
        store.editMode = false
        const field = store.activeElement?.dataset.contentField
        if (!store.activeElement || !field) {
            return
        }
        const container = store.activeElement.querySelector(".ql-editor span") ?? store.activeElement.querySelector(".ql-editor")
        const html = container?.innerHTML ?? ''
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