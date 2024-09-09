import React from 'react'
import { RequestAccessBtn } from './buttons/request-access-btn'
import { User } from '@supabase/supabase-js'
import { prisma } from '@/server/db'
import { RequestListener } from './request-listener'

export const RequestAccessWrapper = async ({
    documentId,
    user,
}: {
    documentId: string
    user: User
}) => {
    const request = await prisma.accessRequest.findUnique({
        where: {
            documentId_userId: {
                documentId,
                userId: user.id,
            },
        },
    })

    if (request?.status === 'PENDING')
        return (
            <main className='flex grow flex-col items-center justify-center gap-2 text-center'>
                <RequestListener documentId={documentId} />
                <h2 className='text-balance text-4xl font-bold'>
                    Your request is pending approval
                </h2>
                <p className='text-balance text-lg text-muted-foreground'>
                    Your request is pending approval. You will be redirected
                    when it is approved.
                </p>
            </main>
        )

    if (request?.status === 'REJECTED')
        return (
            <main className='flex grow flex-col items-center justify-center gap-2 text-center'>
                <h2 className='text-balance text-4xl font-bold'>
                    Your request has been rejected
                </h2>
                <p className='text-balance text-lg text-muted-foreground'>
                    Your request has been rejected. You can request access
                    again. Use the button below.
                </p>
                <RequestAccessBtn documentId={documentId} retry />
            </main>
        )

    return (
        <main className='flex grow flex-col items-center justify-center gap-2 text-center'>
            <h2 className='text-balance text-4xl font-bold'>{`You don't have access to this document`}</h2>
            <p className='text-balance text-lg text-muted-foreground'>
                Press the button below to request access to this document.
            </p>
            <RequestAccessBtn documentId={documentId} />
        </main>
    )
}
