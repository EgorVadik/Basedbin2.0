'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '../ui/button'
import { Loader2, Trash } from 'lucide-react'
import { deleteFile } from '@/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const DeletePopover = ({
    children,
    folderId,
}: {
    children: React.ReactNode
    folderId: string
}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <Button
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true)
                        try {
                            const { error } = await deleteFile(folderId)
                            if (error) {
                                toast.error(error)
                                return
                            }

                            toast.success('File deleted')
                            router.refresh()
                        } catch (error) {
                            toast.error('Something went wrong')
                        } finally {
                            setLoading(false)
                        }
                    }}
                    className='flex w-full items-center gap-1'
                    variant={'destructive'}
                >
                    {loading && <Loader2 className='animate-spin' />}
                    <Trash /> Delete
                </Button>
            </PopoverContent>
        </Popover>
    )
}
