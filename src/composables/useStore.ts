import { reactive } from "vue";
import { ContentSource } from "@vue-content/core";

export interface Store {
    editMode: boolean
    activeElement?: HTMLElement
    contentSource?: ContentSource
}

const store = reactive<Store>({
    editMode: false,
})

export const useStore = () => ({
    store
})