import { reactive } from "vue";
import { ContentSource } from "../../../core/src/plugin/ContentSource";

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