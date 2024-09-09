import { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button, buttonVariants } from '@/components/ui/button'
import { getUsernameFallback } from '@/lib/utils'
import Link from 'next/link'
import { logoutUser } from '@/actions/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ButtonLoading } from '../ui/button-loading'

export const UserInfoBtn = ({ user }: { user: User }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'ghost'}
                    className='mt-auto flex h-auto w-full items-center justify-start gap-2 pt-2 text-left'
                >
                    <Avatar>
                        <AvatarImage src={user.user_metadata.image} />
                        <AvatarFallback>
                            {getUsernameFallback(
                                user.user_metadata.name ?? 'Unknown',
                            )}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <span className='text-sm'>
                            {user.user_metadata.name ?? 'Unknown'}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            {user.email}
                        </span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col gap-2'>
                <Link
                    href='/profile'
                    className={buttonVariants({
                        variant: 'secondary',
                    })}
                >
                    Profile
                </Link>
                <ButtonLoading
                    isLoading={loading}
                    variant={'destructive'}
                    onClick={async () => {
                        setLoading(true)
                        try {
                            const res = await logoutUser()
                            if (!res.success) return toast.error(res.error)
                            toast.success('Logged out')
                            router.replace('/')
                        } catch (error) {
                            toast.error('An error occurred')
                        } finally {
                            setLoading(false)
                        }
                    }}
                >
                    Logout
                </ButtonLoading>
            </PopoverContent>
        </Popover>
    )
}
