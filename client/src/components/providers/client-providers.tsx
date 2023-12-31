'use client'

import { Folder } from '@/types'
import { ThemeProvider } from './theme-provider'
import { ResizableWrapper } from '../wrappers/resizable-wrapper'
import { SessionProvider } from 'next-auth/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const ClientProviders = ({
    children,
    folders,
}: {
    children: React.ReactNode
    folders: Folder[]
}) => {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <DndProvider backend={HTML5Backend}>
                    <ResizableWrapper folders={folders}>
                        {children}
                    </ResizableWrapper>
                </DndProvider>
            </SessionProvider>
        </ThemeProvider>
    )
}
