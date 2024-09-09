import { getCurrentUser } from '@/actions/user'
import { SideBar } from '@/components/sidebar'
import { prisma } from '@/server/db'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function DocumentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const res = await getCurrentUser()
    if (!res.success) notFound()
    const { user } = res.data

    const documents = await prisma.document.findMany({
        where: {
            OR: [
                {
                    ownerId: user.id,
                },
                {
                    users: {
                        some: {
                            id: user.id,
                        },
                    },
                },
            ],
        },
        include: {
            _count: {
                select: {
                    users: true,
                },
            },
            owner: {
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    })

    return (
        <div className='flex min-h-screen'>
            <SideBar documents={documents} user={user} />
            {children}
        </div>
    )
}
