import { useBroadcastEvent, useRoom } from '@liveblocks/react/suspense'
import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { useEventListener } from '@liveblocks/react/suspense'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useDebouncedCallback } from '@mantine/hooks'
import { updateTitle } from '@/actions/documents'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

type EditorProps = {
    title: string
    user: User
    documentId: string
}

const supabase = createClient()

export const useEditor = ({
    title: defaultTitle,
    user,
    documentId,
}: EditorProps) => {
    const [provider, setProvider] = useState<LiveblocksYjsProvider>()
    const [doc, setDoc] = useState<Y.Doc>()
    const [title, setTitle] = useState(defaultTitle)
    const broadcast = useBroadcastEvent()
    const room = useRoom()
    const router = useRouter()

    const handleSaveTitle = useDebouncedCallback(async (title: string) => {
        const res = await updateTitle({
            documentId,
            title,
        })
        if (!res.success) {
            toast.error(res.error)
            return
        }

        broadcast({
            type: 'UPDATE_TITLE',
            title,
        })
    }, 500)

    useEffect(() => {
        const channel = supabase
            .channel(`public:documents:${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'documents',
                },
                async (payload) => {
                    const isCurrentDoc = payload.old.id === documentId
                    if (!isCurrentDoc) return
                    toast.error('This document has been deleted')
                    router.replace('/documents')
                    router.refresh()
                },
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [documentId, router])

    useEffect(() => {
        const yDoc = new Y.Doc()
        const yProvider = new LiveblocksYjsProvider(room, yDoc)
        setDoc(yDoc)
        setProvider(yProvider)

        return () => {
            yDoc?.destroy()
            yProvider?.destroy()
        }
    }, [room])

    useEventListener(({ event }) => {
        if (event == null) return
        if (!(typeof event === 'object' && 'type' in event)) return
        if (event.type === 'REMOVE_USER') {
            if (event.userId === user.id) {
                toast.error('You have been removed from this document')
                router.refresh()
            }
        }

        if (event.type === 'UPDATE_TITLE') {
            setTitle(event.title as string)
        }
    })

    return {
        doc,
        provider,
        title,
        handleSaveTitle,
        setTitle,
    }
}
