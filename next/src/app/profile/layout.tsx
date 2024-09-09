import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'
import { SidebarProfile } from '@/components/sidebar/sidebar-profile'

export const metadata: Metadata = {
    title: 'Profile - Settings',
    description: 'Manage your account settings, user name and profile photo.',
}

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/profile',
    },
    {
        title: 'Documents',
        href: '/documents',
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div className='container space-y-6 py-16'>
                <div className='space-y-0.5'>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        Settings
                    </h2>
                    <p className='text-muted-foreground'>
                        Manage your account settings, user name and profile
                        photo.
                    </p>
                </div>
                <Separator className='my-6' />
                <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <aside className='-mx-4 lg:w-1/5'>
                        <SidebarProfile items={sidebarNavItems} />
                    </aside>
                    <div className='flex-1'>{children}</div>
                </div>
            </div>
        </>
    )
}
