import { Block } from '@vue-content/core'
import { ref, ComputedRef, watchEffect, watch } from 'vue'
import { useStore } from './useStore'

const { store } = useStore()

export function useHighlighter<T>(
  activeBlock: ComputedRef<Block<T> | undefined>
) {
  const highlightedBlock = ref('')
  const highlightedField = ref('')

  watch(highlightedBlock, () => (highlightedField.value = ''))

  watchEffect(() => {
    highlightedBlock.value = String(activeBlock.value?.$blockMeta.id)

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
      blockElement.classList.add('vue-content-highlight')
      const fieldElements = blockElement.querySelectorAll(
        `[data-content-field="${highlightedField.value}"]`
      )
      fieldElements.forEach(fieldElement => {
        fieldElement.classList.add('vue-content-highlight')
      })
    })
  })

  return {
    highlightedBlock,
    highlightedField
  }
}
