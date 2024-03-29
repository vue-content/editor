import { watchEffect, inject, nextTick } from 'vue'
import { useStore, Breadcrumb } from './useStore'
import { ElementPicker } from 'pick-dom-element'
import { ContentSource } from '@vue-content/core'
import { useVueContentEditor } from './useVueContentEditor'

const { store } = useStore()
const { enterEditMode } = useVueContentEditor()

const style = {
  background: 'rgba(54, 173, 106, 0.1)',
  borderColor: '#36ad6a'
}

async function setBreadcrumbs(contentSource: ContentSource, el: HTMLElement) {
  const blockElement = el.closest('[data-content-block]')
  if (!blockElement) {
    console.error('No block element found')
    return
  }
  const id = (blockElement as HTMLElement).dataset.contentBlock

  if (!id) {
    console.error('No block id found')
    return
  }
  let block
  const breadcrumbs: Breadcrumb[] = []
  for (const field of id.split('.')) {
    block =
      !block && field === 'root'
        ? await contentSource.readBlock()
        : await contentSource.readBlock({ parent: block, field })
    breadcrumbs.push({ block, label: field })
  }

  store.breadcrumbs = breadcrumbs
  store.activeBlock = block

  const field = el.dataset?.contentField
  if (field) {
    nextTick(() => {
      document
        .querySelector<HTMLElement>(
          `.content-block-form [data-content-field-input="${field}"] input,
          .content-block-form [data-content-field-input="${field}"] textarea`
        )
        ?.focus()
    })
  }
}

export function usePicker() {
  const picker = new ElementPicker({
    style
  })

  const contentSource = inject<ContentSource>('content-source')
  const stopPicker = () => {
    picker.stop()
    store.pickerActive = false
    document.removeEventListener('click', stopPicker, true)
  }

  watchEffect(() => {
    if (!store.pickerActive) {
      stopPicker()
      return
    }

    picker.start({
      onClick: el => {
        stopPicker()
        if (!contentSource) {
          console.error("Couldn't inject content source")
          return
        }
        setBreadcrumbs(contentSource, el)
        if (el.dataset?.contentField) {
          enterEditMode(contentSource, el)
        }
      },
      elementFilter: el => {
        const closestBlockOrField = el.closest<HTMLElement>(
          '[data-content-block], [data-content-field]'
        )
        return closestBlockOrField ?? false
      }
    })
    document.addEventListener('click', stopPicker, true)
  })

  return {
    picker
  }
}
