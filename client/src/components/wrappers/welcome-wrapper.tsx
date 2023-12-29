import React from 'react'
import { Button } from '../ui/button'
import { FilePlus, FileSymlink, FolderPlus } from 'lucide-react'
import { JoinFileDialog } from '../dialogs/join-file-dialog'
import { NewFilePopover } from '../popovers/new-file-popover'

export const WelcomeWrapper = () => {
    return (
        <div className='mx-auto flex max-w-5xl flex-col gap-5 px-4 py-20'>
            <div>
                <h1 className='text-4xl font-bold'>Basedbin</h1>
                <p className='text-xl font-medium text-muted-foreground'>
                    Create a new file or join an existing one to get started.
                </p>
            </div>

            <div>
                <span className='text-lg'>Start</span>

                <NewFilePopover>
                    <Button
                        variant={'link'}
                        className='flex items-end text-blue-600 dark:text-blue-300'
                    >
                        <FilePlus />
                        <span className='ml-2'>New File...</span>
                    </Button>
                </NewFilePopover>

                <NewFilePopover folder>
                    <Button
                        variant={'link'}
                        className='flex items-end text-blue-600 dark:text-blue-300'
                    >
                        <FolderPlus />
                        <span className='ml-2'>New Folder...</span>
                    </Button>
                </NewFilePopover>

                <JoinFileDialog>
                    <Button
                        variant={'link'}
                        className='flex items-end text-blue-600 dark:text-blue-300'
                    >
                        <FileSymlink />
                        <span className='ml-2'>Join File...</span>
                    </Button>
                </JoinFileDialog>
            </div>
        </div>
    )
}
