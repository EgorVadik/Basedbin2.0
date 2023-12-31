import { cn } from '@/lib/utils'
import { Folder } from '@/types'
import Link from 'next/link'
import React from 'react'
import { DeletePopover } from '../popovers/delete-popover'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { useDrag } from 'react-dnd'

type FileComponentProps = {
    folder: Folder
    pathname: string[]
}

export const FileComponent = ({
    folder: file,
    pathname,
}: FileComponentProps) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'file',
        item: { id: file.id, name: file.name },
        collect(monitor) {
            return {
                isDragging: monitor.isDragging(),
            }
        },
    }))

    if (isDragging) return <div className='h-14' />

    return (
        <div
            ref={dragRef}
            className={cn(
                'py-4 duration-200 hover:bg-muted',
                pathname.at(-1) === file.id && 'bg-muted',
                isDragging && 'hidden',
            )}
        >
            <div className='flex justify-end'>
                <Link
                    href={`/file/${file.id}`}
                    className='mr-auto block w-full grow'
                >
                    <span className='block truncate whitespace-nowrap'>
                        {file.name}
                    </span>
                </Link>
                <DeletePopover folderId={file.id}>
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
    )
}
