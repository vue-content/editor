import { reactive } from "vue";

export interface Store {
    editMode: boolean
    activeElement?: HTMLElement
}

const store = reactive<Store>({
    editMode: false,
})

export const useStore = () => ({
    store
})