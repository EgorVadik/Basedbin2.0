'use client'

import { buttonVariants } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-background'>
            <div className='flex w-full max-w-sm flex-col gap-2'>
                <Link
                    href='/'
                    className={buttonVariants({
                        variant: 'link',
                        className:
                            'flex w-fit items-start justify-start gap-2 px-0 text-left',
                    })}
                >
                    <ArrowLeftCircle />
                    <span>Back to home</span>
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-between text-xl'>
                            <span>
                                {pathname === '/login' ? 'Sign In' : 'Sign Up'}
                            </span>
                        </CardTitle>
                        <CardDescription>
                            {pathname === '/login'
                                ? 'Enter your credentials to access your account'
                                : 'Enter your information to create an account'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>{children}</CardContent>
                </Card>
            </div>
        </main>
    )
}
