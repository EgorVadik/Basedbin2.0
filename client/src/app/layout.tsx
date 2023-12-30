import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ClientProviders } from '@/components/providers/client-providers'
import { Toaster } from '@/components/ui/sonner'
import { getServerAuthSession } from '@/server/auth'
import { nestedChildrenLoop } from '@/lib/constants'
import { prisma } from '@/server/db'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
    title: 'Basedbin',
    openGraph: {
        title: 'Basedbin',
        type: 'website',
    },

    description:
        'An inspiration of hastebin but with a twist, provides a real-time connection with others by sharing the current URL to edit files and preview them together for a better collaboration experience.',
    creator: 'Egor Vadik',
    robots: {
        follow: true,
        index: true,
    },
    keywords: [
        'basedbin',
        'hastebin',
        'code',
        'paste',
        'real-time',
        'collaboration',
        'editor',
        'code editor',
        'code preview',
        'preview',
        'based',
        'bin',
    ],
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerAuthSession()
    const folders =
        session != null
            ? await prisma.folder.findMany({
                  where: {
                      userIds: {
                          has: session?.user?.id,
                      },
                  },
                  include: {
                      ...nestedChildrenLoop(20),
                  },
              })
            : null

    return (
        <html lang='en'>
            <body className={GeistMono.className}>
                <ClientProviders folders={session == null ? [] : folders ?? []}>
                    {children}
                    <Toaster />
                    <Analytics />
                </ClientProviders>
            </body>
        </html>
    )
}
