'use client'

import type { DocumentWithDetails } from '@/types'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import { format } from 'date-fns'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { ButtonLoading } from '@/components/ui/button-loading'
import { toast } from 'sonner'
import { deleteDocument, leaveDocument } from '@/actions/documents'

type SidebarItemProps = {
    document: DocumentWithDetails
    isOwner: boolean
}

export const SidebarItem = ({
    document,
    isOwner = false,
}: SidebarItemProps) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const pathname = usePathname()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await deleteDocument(document.id)
            if (!res.success) return toast.error(res.error)
            router.replace('/documents')
            setOpen(false)
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleLeave = async () => {
        setLoading(true)
        try {
            const res = await leaveDocument(document.id)
            if (!res.success) return toast.error(res.error)
            toast.success('Left document')
            router.replace('/documents')
            router.refresh()
            setOpen(false)
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <li>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <Link
                            href={`/documents/${document.id}`}
                            className={buttonVariants({
                                variant:
                                    pathname === `/documents/${document.id}`
                                        ? 'secondary'
                                        : 'ghost',
                                className: 'h-auto w-full',
                            })}
                        >
                            <div className='flex w-full items-center justify-between text-start'>
                                <div>
                                    <h3>{document.title}</h3>
                                    <p>
                                        {document._count.users} user
                                        {document._count.users === 1 ? '' : 's'}
                                    </p>
                                </div>
                                <span>
                                    {format(
                                        new Date(document.updatedAt),
                                        'MMM dd',
                                    )}
                                </span>
                            </div>
                        </Link>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem asChild>
                            <Button
                                variant={'ghost'}
                                className='mb-1 w-full'
                                size={'sm'}
                                onClick={() => {
                                    window.navigator.clipboard.writeText(
                                        window.location.href,
                                    )
                                    toast.success('URL copied to clipboard')
                                }}
                            >
                                Share
                            </Button>
                        </ContextMenuItem>
                        <AlertDialogTrigger asChild>
                            <ContextMenuItem asChild>
                                <Button
                                    variant={'destructive'}
                                    className='w-full'
                                    size={'sm'}
                                >
                                    {isOwner ? 'Delete' : 'Leave'}
                                </Button>
                            </ContextMenuItem>
                        </AlertDialogTrigger>
                    </ContextMenuContent>
                </ContextMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isOwner
                                ? `This action cannot be undone. This will permanently delete the document and remove all users from it.`
                                : `You will be removed from the document. You can request access again later.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <ButtonLoading
                            isLoading={loading}
                            onClick={isOwner ? handleDelete : handleLeave}
                        >
                            {isOwner ? 'Delete' : 'Leave'}
                        </ButtonLoading>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </li>
    )
}
