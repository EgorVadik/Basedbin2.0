import React from 'react'
import dynamic from 'next/dynamic'
import { z } from 'zod'
import { notFound } from 'next/navigation'
import { prisma } from '@/server/db'
import { LiveblocksProviderWrapper } from '@/components/liveblocks-provider-wrapper'
import { getCurrentUser } from '@/actions/user'
import { RequestAccessWrapper } from '@/components/request-access-wrapper'
const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

const paramSchema = z.object({
    id: z.string().cuid(),
})

export default async function page({ params }: { params: { id?: string } }) {
    const res = paramSchema.safeParse(params)
    if (!res.success) notFound()
    const { id } = res.data

    const userRes = await getCurrentUser()
    if (!userRes.success) notFound()
    const { user } = userRes.data

    const document = await prisma.document.findUnique({
        where: {
            id,
        },
        include: {
            owner: true,
            users: true,
        },
    })

    if (document == null) notFound()

    if (
        document.users.some((u) => u.id === user.id) ||
        document.ownerId === user.id
    )
        return (
            <main className='mx-auto flex w-full max-w-screen-lg grow px-8 py-20 pb-10'>
                <LiveblocksProviderWrapper roomId={`${document.id}`}>
                    <Editor
                        title={document.title}
                        user={user}
                        documentId={document.id}
                        isOwner={document.ownerId === user.id}
                    />
                </LiveblocksProviderWrapper>
            </main>
        )

    return <RequestAccessWrapper documentId={document.id} user={user} />
}
