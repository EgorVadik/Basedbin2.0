'use client'

import { createClient } from '@/utils/supabase/client'
import type { Document, User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserRoundPlus } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { handleAccessRequest, inviteUser } from '@/actions/documents'
import { ButtonLoading } from '@/components/ui/button-loading'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { InviteUser, inviteUserSchema } from '@/actions/documents/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScrollArea } from '@/components/ui/scroll-area'

const supabase = createClient()

type IncomingRequest = Document & { user: User }

export const IncomingRequests = ({ documentId }: { documentId: string }) => {
    const [requests, setRequests] = useState<IncomingRequest[]>([])
    const [loading, setLoading] = useState(false)

    const form = useForm<InviteUser>({
        resolver: zodResolver(inviteUserSchema),
        defaultValues: {
            documentId,
            email: '',
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        const res = await inviteUser(data)
        if (!res.success) {
            return toast.error(res.error)
        }

        toast.success('User invited successfully')
        form.reset()
    })

    const handleClick = async (
        requestId: string,
        status: 'ACCEPTED' | 'REJECTED',
    ) => {
        setLoading(true)
        try {
            const res = await handleAccessRequest({
                documentId,
                requestId,
                status,
            })

            if (!res.success) return toast.error(res.error)
            setRequests((prev) =>
                prev.filter((request) => request.id !== requestId),
            )
            toast.success(
                `Request ${status === 'ACCEPTED' ? 'accepted' : 'rejected'}`,
            )
        } catch (error) {
            toast.error(
                `Failed to ${status === 'ACCEPTED' ? 'accept' : 'reject'} request`,
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchRequests = async () => {
            const { data, error } = await supabase
                .from('access_requests')
                .select(
                    `
                    *,
                    user:userId(*)
                `,
                )
                .eq('documentId', documentId)
                .eq('status', 'PENDING')
            if (error)
                return toast.error(
                    'Failed to fetch access requests for this document',
                )

            setRequests(data)
        }

        fetchRequests()
    }, [documentId])

    useEffect(() => {
        const accessRequests = supabase
            .channel(`public:access_requests:${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'access_requests',
                },
                async (payload) => {
                    const isCurrentDoc = payload.new.documentId === documentId
                    if (!isCurrentDoc) return
                    if (payload.new.status !== 'PENDING') return
                    const { data: user, error } = await supabase
                        .from('users')
                        .select()
                        .eq('id', payload.new.userId)
                        .single()
                    if (error)
                        return toast.error(
                            'A user requested access but failed to fetch user data',
                        )

                    setRequests((prev) => [
                        ...prev,
                        {
                            ...(payload.new as Document),
                            user,
                        },
                    ])
                },
            )
            .subscribe()

        return () => {
            accessRequests.unsubscribe()
        }
    }, [documentId])

    return (
        <div className='ml-8'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        size={'icon'}
                        variant={'outline'}
                        className='relative'
                    >
                        {requests.length > 0 && (
                            <div className='absolute -right-2 -top-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-white' />
                        )}
                        <UserRoundPlus />
                    </Button>
                </DialogTrigger>
                <DialogOverlay className='z-[99999]' />
                <DialogContent className='z-[99999]'>
                    <ScrollArea className='h-[85vh]'>
                        <DialogHeader>
                            <DialogTitle>
                                {requests.length} Incoming Request
                                {requests.length === 1 ? '' : 's'}
                            </DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={onSubmit} className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='example@mail.com'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Quick invite a user to this
                                                document without confirmation
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <ButtonLoading
                                    type='submit'
                                    isLoading={form.formState.isSubmitting}
                                    className='w-full'
                                >
                                    Invite User
                                </ButtonLoading>
                            </form>
                        </Form>

                        <div className='mt-4 flex flex-col gap-2'>
                            {requests.map((request) => (
                                <Card
                                    key={request.id}
                                    className='flex flex-col items-start justify-between sm:flex-row sm:items-end'
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            {request.user.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {request.user.email}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className='flex w-full flex-col items-center gap-2 sm:flex-row'>
                                        <ButtonLoading
                                            size={'sm'}
                                            isLoading={loading}
                                            className='w-full sm:w-auto'
                                            onClick={async () => {
                                                await handleClick(
                                                    request.id,
                                                    'ACCEPTED',
                                                )
                                            }}
                                        >
                                            Accept
                                        </ButtonLoading>
                                        <ButtonLoading
                                            size={'sm'}
                                            variant={'outline'}
                                            className='w-full sm:w-auto'
                                            isLoading={loading}
                                            onClick={async () => {
                                                await handleClick(
                                                    request.id,
                                                    'REJECTED',
                                                )
                                            }}
                                        >
                                            Reject
                                        </ButtonLoading>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
