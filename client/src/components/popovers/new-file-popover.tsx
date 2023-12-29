'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SingleValueSchema, singleValueSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'
import { createFile, createFolder } from '@/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export const NewFilePopover = ({
    children,
    folder = false,
    parentId,
}: {
    children: React.ReactNode
    folder?: boolean
    parentId?: string
}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SingleValueSchema>({
        resolver: zodResolver(singleValueSchema),
        defaultValues: {
            value: '',
        },
    })

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true)
        try {
            if (!folder) {
                const file = await createFile(data.value, parentId)
                if (file.error) {
                    toast.error(file.error)
                    return
                }

                router.push(`/file/${file.data?.id}`)
                router.refresh()
                return
            }

            const newFolder = await createFolder(data.value, parentId)
            if (newFolder.error) {
                toast.error(newFolder.error)
                return
            }

            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    })

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                    <Label htmlFor='new-file' className='text-lg'>
                        {folder ? '📁 Folder Name' : '📄 File Name'}
                    </Label>
                    <Input
                        id='new-file'
                        placeholder={
                            folder ? 'Enter a folder name' : 'Enter a file name'
                        }
                        className={cn(errors.value && 'border-red-500')}
                        {...register('value')}
                    />
                    {errors.value && (
                        <span className='text-sm text-red-500'>
                            {errors.value.message}
                        </span>
                    )}
                    <div className='mt-2 flex items-end justify-end'>
                        <Button
                            disabled={loading}
                            className='flex items-center gap-2'
                        >
                            {loading && <Loader2 className='animate-spin' />}
                            Create
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}
