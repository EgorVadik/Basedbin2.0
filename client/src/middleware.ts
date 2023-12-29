import type { JWT } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = (await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!,
    })) as JWT | null

    const { pathname } = req.nextUrl
    const user = token?.user

    if (user && (pathname === '/login' || pathname === 'register')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (user == null && (pathname === '/' || pathname.includes('/file/'))) {
        return NextResponse.redirect(
            new URL(`/login?callbackUrl=${pathname}`, req.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login', '/register', '/file/:path*'],
}
