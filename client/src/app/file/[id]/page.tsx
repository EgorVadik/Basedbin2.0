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

    if (file == null) {
        return notFound()
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
