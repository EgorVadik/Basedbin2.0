'use client'

import {
    type DefaultReactSuggestionItem,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useTheme } from 'next-themes'
import { filterSuggestionItems, type BlockNoteEditor } from '@blocknote/core'
import TextareaAutosize from 'react-textarea-autosize'
import * as Y from 'yjs'
import { User } from '@supabase/supabase-js'
import { UserAvatars } from './user-avatars'
import { getUserCaretColor, uploadFile } from '@/lib/utils'
import { useEditor } from '@/hooks/use-editor'

type EditorProps = {
    title: string
    user: User
    documentId: string
    isOwner: boolean
}

type BlockNoteProps = {
    doc: Y.Doc
    provider: unknown
    handleSaveTitle: (title: string) => void
    setTitle: (title: string) => void
} & EditorProps

export default function Editor({
    title: defaultTitle,
    user,
    documentId,
    isOwner,
}: EditorProps) {
    const { doc, handleSaveTitle, provider, title, setTitle } = useEditor({
        title: defaultTitle,
        user,
        documentId,
    })

    if (!doc || !provider) {
        return null
    }

    return (
        <BlockNote
            doc={doc}
            provider={provider}
            title={title}
            user={user}
            documentId={documentId}
            isOwner={isOwner}
            handleSaveTitle={handleSaveTitle}
            setTitle={setTitle}
        />
    )
}

function BlockNote({
    title,
    doc,
    provider,
    user,
    documentId,
    isOwner,
    handleSaveTitle,
    setTitle,
}: BlockNoteProps) {
    const { resolvedTheme } = useTheme()
    const editor = useCreateBlockNote({
        async uploadFile(file) {
            return await uploadFile(file, documentId, file.name)
        },
        collaboration: {
            provider,
            fragment: doc.getXmlFragment('blocknote'),
            user: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                id: user.id,
                name: `${user.user_metadata.name}`,
                image: user.user_metadata.image,
                color: getUserCaretColor(
                    user.id,
                    resolvedTheme as 'light' | 'dark',
                ),
            },
        },
    })

    const getCustomSlashMenuItems = (
        editor: BlockNoteEditor,
    ): DefaultReactSuggestionItem[] => [
        ...getDefaultReactSlashMenuItems(editor).filter(
            (item) => item.title !== 'Emoji',
        ),
    ]

    return (
        <div className='flex h-full w-full grow flex-col items-start gap-3'>
            <UserAvatars
                documentId={documentId}
                isOwner={isOwner}
                user={user}
            />
            <TextareaAutosize
                className='max-h-40 w-full resize-none bg-transparent text-4xl font-bold'
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                    handleSaveTitle(e.target.value)
                }}
            />
            <BlockNoteView
                editor={editor}
                className='mx-auto h-full w-full max-w-screen-lg [&>div]:!bg-transparent [&_.bn-inline-content]:break-all first:[&_>div]:h-full'
                slashMenu={false}
                data-color-scheme={resolvedTheme}
            >
                <SuggestionMenuController
                    triggerCharacter='/'
                    getItems={async (query) =>
                        filterSuggestionItems(
                            getCustomSlashMenuItems(editor),
                            query,
                        )
                    }
                />
            </BlockNoteView>
        </div>
    )
}
