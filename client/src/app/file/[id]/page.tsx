import { Editor } from '@/components/forms/editor'
import { getServerAuthSession } from '@/server/auth'
import { prisma } from '@/server/db'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({
    params: { id: room },
}: {
    params: { id: string }
}) {
    const session = await getServerAuthSession()
    const file = await prisma.folder.findUnique({
        where: {
            id: room,
        },
    })

    if (file == null || session == null) {
        return notFound()
    }

    if (!file.userIds.some((user) => user.userId === session.user.id)) {
        await prisma.folder.update({
            where: {
                id: room,
            },
            data: {
                userIds: {
                    push: {
                        userId: session.user.id,
                    },
                },
            },
        })
    }

    return (
        <Editor
            room={room}
            session={session}
            content={file?.content ?? ''}
            language={file?.extension ?? undefined}
        />
    )
}
