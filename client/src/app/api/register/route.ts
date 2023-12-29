import { prisma } from '@/server/db'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { registerSchema } from '@/lib/validations'

export async function POST(req: Request) {
    const data = await req.json()

    try {
        const { username, password } = registerSchema.parse(data)

        await prisma.user.create({
            data: {
                username,
                password: await hash(password, 10),
            },
        })

        return new NextResponse('Successfully registered', { status: 201 })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return new NextResponse('Username already exists', {
                    status: 409,
                })
            }
        }
        if (error instanceof ZodError) {
            return new NextResponse('Invalid data', { status: 400 })
        }

        return new NextResponse('Something went wrong', { status: 500 })
    }
}
