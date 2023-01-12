import { reactive } from "vue";

interface Store {
    editMode: boolean
    activeElement?: HTMLElement
}

export const store = reactive<Store>({
    editMode: false,
})