'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export const LogoutPopover = ({ children }: { children: React.ReactNode }) => {
    return (
        <Popover>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent>
                <Button
                    onClick={async () => await signOut()}
                    className='flex w-full items-center gap-1'
                    variant={'destructive'}
                >
                    <LogOut /> Logout
                </Button>
            </PopoverContent>
        </Popover>
    )
}
