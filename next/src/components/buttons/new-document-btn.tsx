'use client'

import { newDocument } from '@/actions/documents'
import { NewDocument, newDocumentSchema } from '@/actions/documents/schema'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ButtonLoading } from '@/components/ui/button-loading'
import { useState } from 'react'

type NewDocumentBtnProps = {
    children: React.ReactNode
}

export const NewDocumentBtn = ({ children }: NewDocumentBtnProps) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const form = useForm<NewDocument>({
        resolver: zodResolver(newDocumentSchema),
        defaultValues: {
            title: '',
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        const res = await newDocument(data.title)
        if (!res.success) {
            return toast.error(res.error)
        }

        toast.success('Document created successfully')
        router.push(`/documents/${res.data.id}`)
        router.refresh()
        setOpen(false)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new bin</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Some title'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ButtonLoading
                            type='submit'
                            isLoading={form.formState.isSubmitting}
                            className='w-full'
                        >
                            Create bin
                        </ButtonLoading>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
