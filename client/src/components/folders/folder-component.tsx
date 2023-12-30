import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion'
import { NewFilePopover } from '../popovers/new-file-popover'
import { Button } from '../ui/button'
import { FilePlus, FolderPlus, Trash } from 'lucide-react'
import { deleteFile } from '@/actions'
import { toast } from 'sonner'
import { FolderAccordion } from './folder-accordion'
import { Folder } from '@/types'
import { useRouter } from 'next/navigation'

type FolderComponentProps = {
    folder: Folder
    userId: string
}

export const FolderComponent = ({ folder, userId }: FolderComponentProps) => {
    const router = useRouter()

    return (
        <Droppable droppableId={folder.id} type='folder'>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Draggable draggableId={folder.id} index={0} isDragDisabled>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <AccordionItem value={folder.id}>
                                    <div className='flex items-center justify-between gap-2'>
                                        <AccordionTrigger className='gap-1 truncate whitespace-nowrap'>
                                            {folder.name}
                                        </AccordionTrigger>
                                        <div className='flex items-center gap-1'>
                                            <NewFilePopover
                                                parentId={folder.id}
                                            >
                                                <Button
                                                    variant={'ghost'}
                                                    size={'icon'}
                                                    className='h-6 w-6'
                                                >
                                                    <FilePlus size={16} />
                                                </Button>
                                            </NewFilePopover>
                                            <NewFilePopover
                                                parentId={folder.id}
                                                folder
                                            >
                                                <Button
                                                    variant={'ghost'}
                                                    size={'icon'}
                                                    className='h-6 w-6'
                                                >
                                                    <FolderPlus size={16} />
                                                </Button>
                                            </NewFilePopover>
                                            <Button
                                                variant={'destructive'}
                                                size={'icon'}
                                                className='h-6 w-6'
                                                onClick={async () => {
                                                    const { error } =
                                                        await deleteFile(
                                                            folder.id,
                                                        )
                                                    if (error) {
                                                        toast.error(error)
                                                        return
                                                    }
                                                    toast.success(
                                                        'File deleted',
                                                    )
                                                    router.refresh()
                                                }}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    <AccordionContent className={'pl-4'}>
                                        {folder.children?.map((folder) => (
                                            <FolderAccordion
                                                key={folder.id}
                                                folder={folder}
                                                userId={userId}
                                            />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        )}
                    </Draggable>
                </div>
            )}
        </Droppable>
    )
}
