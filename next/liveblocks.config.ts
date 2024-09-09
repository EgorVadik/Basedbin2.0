import { LiveMap, LiveObject } from '@liveblocks/client'

export type Note = LiveObject<{
    x: number
    y: number
    text: string
    selectedBy: Liveblocks['UserMeta']['id'] | null
    id: string
}>

export type Notes = LiveMap<string, Note>

declare global {
    interface Liveblocks {
        UserMeta: {
            id: string
            name: string
        }
        Presence: {
            cursor: { x: number; y: number }
            user?: {
                id: string
                name: string
                color: string
                image?: string
            }
        }
    }
}
