import React from 'react'
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion'
import { NewFilePopover } from '../popovers/new-file-popover'
import { Button } from '../ui/button'
import { FilePlus, FolderPlus, Trash } from 'lucide-react'
import { deleteFile, reorderFile } from '@/actions'
import { toast } from 'sonner'
import { FolderAccordion } from './folder-accordion'
import { Folder } from '@/types'
import { useRouter } from 'next/navigation'
import { useDrop } from 'react-dnd'
import { cn } from '@/lib/utils'
import { DeletePopover } from '../popovers/delete-popover'

type FolderComponentProps = {
    folder: Folder
    userId: string
}

export const FolderComponent = ({ folder, userId }: FolderComponentProps) => {
    const router = useRouter()
    const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
        accept: 'file',
        drop: async (
            item: {
                id: string
                name: string
            },
            monitor,
        ) => {
            if (monitor.didDrop()) return
            const { error } = await reorderFile(item.id, folder.id)
            if (error) {
                toast.error(error)
                return
            }

            router.refresh()
        },
        collect(monitor) {
            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }
        },
    }))

    return (
        <div ref={dropRef}>
            <AccordionItem
                value={folder.id}
                className='border-l border-l-transparent duration-100 hover:border-border'
            >
                <div
                    className={cn(
                        'group flex items-center justify-between gap-2',
                        canDrop &&
                            isOver &&
                            'cursor-none bg-muted duration-200',
                    )}
                >
                    <AccordionTrigger className='gap-1 truncate whitespace-nowrap'>
                        {folder.name}
                    </AccordionTrigger>
                    <div className='flex items-center gap-1'>
                        <NewFilePopover parentId={folder.id}>
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                className='h-6 w-6'
                            >
                                <FilePlus size={16} />
                            </Button>
                        </NewFilePopover>
                        <NewFilePopover parentId={folder.id} folder>
                            <Button
                                variant={'ghost'}
                                size={'icon'}
                                className='h-6 w-6'
                            >
                                <FolderPlus size={16} />
                            </Button>
                        </NewFilePopover>
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
    )
}
