'use client'

import { FolderAccordion } from '../folders/folder-accordion'
import { Folder } from '@/types'
import { Accordion } from '../ui/accordion'
import { Session } from 'next-auth'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

type FolderWrapperProps = {
    folders: Folder[]
    session: Session
}

const groupBy = (xs: Folder[], key: 'parentId') => {
    return xs.reduce(
        (rv, x) => {
            const parentExists = xs.some((folder) => folder.id === x[key])
            const parentKey = parentExists ? x[key] ?? 'root' : 'root'
            ;(rv[parentKey] = rv[parentKey] || []).push(x)
            return rv
        },
        {} as Record<string, Folder[]>,
    )
}

export const FolderWrapper = ({ folders, session }: FolderWrapperProps) => {
    const rootFolder = groupBy(folders, 'parentId')['root']

    return (
        <DragDropContext
            onDragEnd={(res) => {
                console.log(res)
            }}
        >
            <Accordion type='multiple' className='grow px-3'>
                {rootFolder?.map((folder) => (
                    <FolderAccordion
                        key={folder.id}
                        folder={folder}
                        userId={session.user.id}
                    />
                ))}
            </Accordion>
        </DragDropContext>
    )
}
