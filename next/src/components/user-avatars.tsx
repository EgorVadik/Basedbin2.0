import {
    useBroadcastEvent,
    useMyPresence,
    useOthers,
} from '@liveblocks/react/suspense'
import React, { useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getUsernameFallback } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { IncomingRequests } from './incoming-requests'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ButtonLoading } from '@/components/ui/button-loading'
import { User } from '@supabase/supabase-js'
import { removeUserFromDocument } from '@/actions/documents'
import { toast } from 'sonner'
import { ThemeToggle } from './theme/theme-toggle'
import { useMediaQuery } from '@mantine/hooks'
// import Link from 'next/link'
// import { buttonVariants } from './ui/button'

export const UserAvatars = ({
    documentId,
    isOwner = false,
    user,
}: {
    documentId: string
    isOwner: boolean
    user: User
}) => {
    const matches = useMediaQuery('(min-width: 768px)')
    const broadcast = useBroadcastEvent()
    const [loading, setLoading] = useState(false)
    const [myPresence] = useMyPresence()
    const others = useOthers()
    const presence = useMemo(
        () =>
            [myPresence, ...others.map((other) => other.presence)].splice(
                0,
                matches ? 10 : 4,
            ) as {
                cursor: { x: number; y: number }
                __yjs: {
                    user: {
                        id: string
                        name: string
                        color: string
                        image?: string
                    }
                }
            }[],
        [myPresence, others, matches],
    )

    if (presence?.length === 0) return null

    return (
        <>
            {/* <div className='flex w-full items-center justify-center'>
                <div className='grid w-fit grid-cols-2 items-center gap-2 rounded-md border px-4 py-2'>
                    <Link
                        href={`/documents/${documentId}`}
                        className={buttonVariants({
                            variant:
                                pathName === `/documents/${documentId}`
                                    ? 'secondary'
                                    : 'ghost',
                        })}
                    >
                        Document
                    </Link>
                    <Link
                        href={`/documents/${documentId}/canvas`}
                        className={buttonVariants({
                            variant:
                                pathName === `/documents/${documentId}/canvas`
                                    ? 'secondary'
                                    : 'ghost',
                        })}
                    >
                        Canvas
                    </Link>
                </div>
            </div> */}
            <div className='fixed right-8 top-4 z-50 flex items-center'>
                {presence.map((p, i) => (
                    <Popover key={i}>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <PopoverTrigger asChild>
                                    <TooltipTrigger>
                                        <Avatar className='-mr-4 border-2 border-black bg-background hover:z-20 dark:border-white'>
                                            <AvatarImage
                                                src={p.__yjs?.user.image}
                                            />
                                            <AvatarFallback>
                                                {getUsernameFallback(
                                                    p.__yjs?.user.name ||
                                                        'Unknown',
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                </PopoverTrigger>
                                <TooltipContent>
                                    {p.__yjs?.user.name || 'Unknown'}{' '}
                                    {p.__yjs?.user.id === user.id && '(You)'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {isOwner && user.id !== p.__yjs?.user.id && (
                            <PopoverContent className='w-fit'>
                                <ButtonLoading
                                    size={'sm'}
                                    variant={'destructive'}
                                    onClick={async () => {
                                        setLoading(true)
                                        try {
                                            const res =
                                                await removeUserFromDocument(
                                                    documentId,
                                                    p.__yjs?.user.id,
                                                )
                                            if (!res.success)
                                                return toast.error(res.error)
                                            toast.success('User removed')
                                            broadcast({
                                                type: 'REMOVE_USER',
                                                userId: p.__yjs?.user.id,
                                            })
                                        } catch (error) {
                                            toast.error('An error occurred')
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}
                                    isLoading={loading}
                                >
                                    Remove
                                </ButtonLoading>
                            </PopoverContent>
                        )}
                    </Popover>
                ))}
                {isOwner && <IncomingRequests documentId={documentId} />}
                <div className={cn(isOwner ? 'ml-2' : 'ml-8')}>
                    <ThemeToggle />
                </div>
            </div>
        </>
    )
}
