import { reactive } from 'vue'
import { ContentSource, Block } from '@vue-content/core'

export interface Breadcrumb {
  label: string
  block: Block<unknown>
}

export interface Store {
  editMode: boolean
  openDrawer: boolean
  activeElement?: HTMLElement
  activeBlock?: Block
  contentSource?: ContentSource
  breadcrumbs: Breadcrumb[]
  drawerWidth: number
}

const store = reactive<Store>({
  editMode: false,
  openDrawer: true,
  breadcrumbs: [],
  drawerWidth: 300
})

export const useStore = () => ({
  store
})
