import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const updateSession = async (request: NextRequest) => {
    if (request.method === 'POST') {
        return NextResponse.next()
    }

    const pathname = request.nextUrl.pathname
    const isPublicRoute =
        pathname === '/login' || pathname === '/register' || pathname === '/'

    try {
        let response = NextResponse.next()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value),
                        )
                        response = NextResponse.next()
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options),
                        )
                    },
                },
            },
        )

        const user = await supabase.auth.getUser()

        if (
            (pathname.startsWith('/documents') || pathname === '/profile') &&
            user.error
        ) {
            return NextResponse.redirect(
                new URL(`/login?callbackUrl=${request.url}`, request.url),
            )
        }

        if (isPublicRoute && !user.error) {
            return NextResponse.redirect(new URL('/documents', request.url))
        }

        return response
    } catch (e) {
        return NextResponse.next()
    }
}
