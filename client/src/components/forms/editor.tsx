'use client'

import React, { useEffect } from 'react'
import { Editor as EditorComponent } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import { Session } from 'next-auth'
import { COLORS, languages } from '@/lib/constants'
import { useTheme } from 'next-themes'
import { useAtom } from 'jotai'
import { fileAtom } from '@/atoms'
import { Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { saveContent } from '@/actions'

type EditorProps = {
    room: string
    session: Session | null
    content: string
    language?: string
}

export const Editor = ({ room, session, language, content }: EditorProps) => {
    const [file, setFile] = useAtom(fileAtom)
    const { theme, systemTheme } = useTheme()
    const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)
    const isDark =
        theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

    useDebounce({
        effect: async () => {
            await saveContent(room, file.content ?? '')
        },
        delay: 10000,
        deps: [file],
    })

    useEffect(() => {
        setFile((prev) => {
            return {
                ...prev,
                ext: language,
            }
        })
    }, [language, setFile, room])

    return (
        <EditorComponent
            defaultValue={content.length > 0 ? content : undefined}
            loading={<Loader2 className='h-20 w-20 animate-spin' />}
            height='100%'
            defaultLanguage={
                languages.find((l) => l.ext === language)?.lang ?? 'plaintext'
            }
            theme={isDark ? 'vs-dark' : 'vs-light'}
            onChange={(value) => {
                setFile((prev) => {
                    return {
                        ...prev,
                        content: value ?? '',
                    }
                })
            }}
            onMount={(editor, monaco) => {
                if (session == null) return
                editorRef.current = editor
                const doc = new Y.Doc()
                const provider = new WebsocketProvider(
                    'wss://basedbin3-0.onrender.com',
                    // 'ws://localhost:4000',
                    // 'wss://demos.yjs.dev/ws',
                    room,
                    doc,
                )
                const type = doc.getText(`monaco-${room}`)
                const monacoBinding = new MonacoBinding(
                    type,
                    editorRef.current.getModel()!,
                    new Set([editorRef.current]),
                    provider.awareness,
                )
                const cursorDecorations: string[] = []

                monacoBinding.awareness?.setLocalStateField('user', {
                    username: session.user?.username,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                })

                monacoBinding.awareness?.on('update', () => {
                    cursorDecorations.forEach((decorationId) => {
                        editorRef.current
                            ?.getModel()
                            ?.deltaDecorations([decorationId], [])
                    })

                    cursorDecorations.length = 0

                    monacoBinding.awareness?.getStates().forEach((state) => {
                        const { user, cursor } = state
                        if (
                            user != null &&
                            cursor != null &&
                            session.user?.username !== user.username
                        ) {
                            const { username, color } = user
                            const position = {
                                lineNumber: cursor.lineNumber ?? 0,
                                column: cursor.column ?? 0,
                            }

                            const decorationId = editorRef.current
                                ?.getModel()
                                ?.deltaDecorations(
                                    [],
                                    [
                                        {
                                            range: new monaco.Range(
                                                position.lineNumber,
                                                position.column,
                                                position.lineNumber,
                                                position.column + 1,
                                            ),
                                            options: {
                                                isWholeLine: false,
                                                className: `border-l-2 m-[-1px] ${color}`,
                                                blockClassName:
                                                    'bg-red-200 bg-opacity-15',
                                                hoverMessage: {
                                                    value: username,
                                                },
                                            },
                                        },
                                    ],
                                )[0]

                            cursorDecorations.push(decorationId ?? '')
                        }
                    })
                })

                editor.onDidChangeCursorPosition((e) => {
                    const cursor = editor.getPosition()
                    monacoBinding.awareness?.setLocalStateField('cursor', {
                        lineNumber: cursor?.lineNumber,
                        column: cursor?.column,
                    })
                })
            }}
        />
    )
}
