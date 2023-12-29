'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { FolderWrapper } from './folder-wrapper'
import { Folder } from '@/types'
import { Sidebar } from '../sidebar/sidebar'
import { usePathname } from 'next/navigation'
import { useAtom } from 'jotai'
import { fileAtom } from '@/atoms'
import { RenderMarkdown } from './render-markdown'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useSession } from 'next-auth/react'

type ResizableWrapperProps = {
    folders: Folder[]
    children: React.ReactNode
}

export const ResizableWrapper = ({
    folders,
    children,
}: ResizableWrapperProps) => {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [file] = useAtom(fileAtom)
    const { isTablet } = useMediaQuery()

    return (
        <ResizablePanelGroup direction='horizontal' className='min-h-screen'>
            <ResizablePanel
                defaultSize={15}
                maxSize={isTablet ? 100 : 30}
                minSize={10}
                collapsedSize={0}
                collapsible
                className='flex'
            >
                <Sidebar />
                {session != null && (
                    <FolderWrapper folders={folders} session={session} />
                )}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={
                    pathname.includes('/file') && file.ext === 'md' ? 80 : 85
                }
            >
                {children}
            </ResizablePanel>
            {pathname.includes('/file') && file.ext === 'md' && (
                <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={5}>
                        <RenderMarkdown />
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    )
}
