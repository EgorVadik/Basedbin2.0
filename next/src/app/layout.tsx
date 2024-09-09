import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import NextTopLoader from 'nextjs-toploader'
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
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`${GeistSans.className} antialiased`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextTopLoader />
                    {children}
                    <Toaster />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    )
}
