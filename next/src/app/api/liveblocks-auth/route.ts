import { getCurrentUser } from '@/actions/user'
import { prisma } from '@/server/db'
import { Liveblocks } from '@liveblocks/node'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(request: NextRequest) {
    try {
        const res = await getCurrentUser()
        if (!res.success) return new Response(res.error, { status: 401 })
        const { user } = res.data
        const queryParams = new URL(request.url).searchParams

        const { roomId } = z
            .object({
                roomId: z.string().cuid(),
            })
            .parse({ roomId: queryParams.get('roomId') })

        const session = liveblocks.prepareSession(user.id, {
            userInfo: {
                id: user.id,
                name: user.user_metadata.name,
                email: user.email,
            },
        })

        const doc = await prisma.document.findUnique({
            where: {
                id: roomId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!doc) return new Response('Document not found', { status: 404 })
        if (!doc.users.some((u) => u.id === user.id))
            return new Response('Unauthorized', { status: 401 })

        session.allow(doc.id, session.FULL_ACCESS)

        const { body, status } = await session.authorize()
        return new Response(body, { status })
    } catch (error) {
        return new Response((error as Error).message, { status: 500 })
    }
}
