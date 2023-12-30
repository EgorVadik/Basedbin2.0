import { atom } from 'jotai'

export const fileAtom = atom<{
    ext?: string
    content?: string
}>({})

export const infoAtom = atom<
    {
        username: string
        lineNumber: number
    }[]
>([])
