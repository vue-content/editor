import { reactive } from "vue";
import { ContentSource } from "@vue-content/core";

export interface Store {
    editMode: boolean
    openDrawer: boolean
    activeElement?: HTMLElement
    contentSource?: ContentSource
    drawerWidth: number
}

const store = reactive<Store>({
    editMode: false,
    openDrawer: false,
    drawerWidth: 300
})

export const useStore = () => ({
    store
})