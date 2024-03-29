import { Block } from '@vue-content/core'
import { useActiveElement } from '@vueuse/core'
import { ref, ComputedRef, watchEffect, watch } from 'vue'
import { useStore } from './useStore'

const { store } = useStore()

export function useHighlighter<T>(
  activeBlock: ComputedRef<Block<T> | undefined>
) {
  const highlightedBlock = ref('')
  const highlightedField = ref<string | undefined>('')

  const activeElement = useActiveElement()

  // watch(highlightedBlock, () => (highlightedField.value = ''))

  watchEffect(() => {
    highlightedBlock.value = String(activeBlock.value?.$blockMeta.id)
    // const closestField = activeElement.value?.closest<HTMLElement>(
    //   '[data-content-field-input], [data-content-field]'
    // )
    // highlightedField.value =
    //   closestField?.dataset?.contentField ??
    //   closestField?.dataset?.contentFieldInput

    document
      .querySelectorAll('.vue-content-highlight')
      .forEach(hov => hov.classList.remove('vue-content-highlight'))
    if (!store.highlightActive || store.pickerActive) {
      return
    }
    const blockElements = document.querySelectorAll(
      `[data-content-block="${highlightedBlock.value}"]`
    )
    blockElements.forEach(blockElement => {
      const fieldElements = blockElement.querySelectorAll(
        `[data-content-field="${highlightedField.value}"]`
      )
      fieldElements.forEach(fieldElement => {
        fieldElement.classList.add('vue-content-highlight')
      })
      if (fieldElements.length === 0) {
        blockElement.classList.add('vue-content-highlight')
      }
    })
  })

  return {
    highlightedBlock,
    highlightedField
  }
}
