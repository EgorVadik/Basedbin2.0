import { cn } from '@/lib/utils'
import { Folder } from '@/types'
import Link from 'next/link'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { DeletePopover } from '../popovers/delete-popover'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'

type FileComponentProps = {
    folder: Folder
    pathname: string[]
}

export const FileComponent = ({ folder, pathname }: FileComponentProps) => {
    return (
        <Droppable droppableId={folder.id} type='file'>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable draggableId={folder.id} index={0}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                    'py-4 duration-200 hover:bg-muted',
                                    pathname.at(-1) === folder.id && 'bg-muted',
                                )}
                            >
                                <div className='flex justify-end'>
                                    <Link
                                        href={`/file/${folder.id}`}
                                        className='mr-auto block w-full grow'
                                    >
                                        <span className='block truncate whitespace-nowrap'>
                                            {folder.name}
                                        </span>
                                    </Link>
                                    <DeletePopover folderId={folder.id}>
                                        <Button
                                            variant={'destructive'}
                                            size={'icon'}
                                            className='h-6 w-6'
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </DeletePopover>
                                </div>
                            </div>
                        )}
                    </Draggable>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}
