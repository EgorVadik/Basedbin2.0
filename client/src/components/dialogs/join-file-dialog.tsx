'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SingleValueSchema, singleValueSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { joinFile } from '@/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export const JoinFileDialog = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
            const { error } = await joinFile(data.value)
            if (error) {
                toast.error(error)
                return
            }

            router.push(`/file/${data.value}`)
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    })

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                    <Label htmlFor='join-room' className='text-lg'>
                        Room ID
                    </Label>
                    <Input
                        id='join-room'
                        placeholder='Enter a room ID'
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
                            Join
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
