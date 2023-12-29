import { atom } from 'jotai'

export const fileAtom = atom<{
    ext?: string
    content?: string
}>({})
