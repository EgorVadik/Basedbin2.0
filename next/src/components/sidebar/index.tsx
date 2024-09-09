'use client'

import { FilePlus, FileX, Menu } from 'lucide-react'
import { NewDocumentBtn } from '../buttons/new-document-btn'
import { Button } from '@/components/ui/button'
import type { DocumentWithDetails } from '@/types'
import { SidebarItem } from './sidebar-item'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@mantine/hooks'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { UserInfoBtn } from '../buttons/user-info-btn'

export const SideBar = ({
    documents,
    user,
}: {
    documents: DocumentWithDetails[]
    user: User
}) => {
    const [open, setOpen] = useState(false)
    const matches = useMediaQuery('(min-width: 768px)')

    if (matches)
        return (
            <aside className='hidden w-full max-w-xs border-r p-4 md:block'>
                <nav
                    className={cn(
                        'sticky top-5',
                        documents.length === 0 && 'h-[90%]',
                    )}
                >
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-lg font-semibold'>
                                Recent Bins
                            </h2>
                            <NewDocumentBtn>
                                <Button size={'icon'} variant={'outline'}>
                                    <span className='sr-only'>
                                        New Document
                                    </span>
                                    <FilePlus />
                                </Button>
                            </NewDocumentBtn>
                        </div>
                        <ScrollArea className='h-[calc(100vh-10rem)]'>
                            {documents.length === 0 ? (
                                <div className='flex h-[calc(95vh-10rem)] flex-col items-center justify-center gap-3'>
                                    <FileX size={64} className='shrink-0' />
                                    <p className='text-lg text-muted-foreground'>
                                        No documents found
                                    </p>
                                </div>
                            ) : (
                                <ul className='flex flex-col gap-2 pt-2'>
                                    {documents.map((doc) => (
                                        <SidebarItem
                                            key={doc.id}
                                            document={doc}
                                            isOwner={doc.ownerId === user.id}
                                        />
                                    ))}
                                </ul>
                            )}
                        </ScrollArea>
                        <Separator />
                        <UserInfoBtn user={user} />
                    </div>
                </nav>
            </aside>
        )

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                asChild
                className={cn('fixed left-8 top-4', !open && 'z-[9999]')}
            >
                <Button size={'icon'} variant={'outline'}>
                    <span className='sr-only'>Open sidebar</span>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className='flex flex-col gap-2'>
                <SheetHeader>
                    <SheetTitle>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-lg font-semibold'>
                                Recent Bins
                            </h2>
                            <NewDocumentBtn>
                                <Button size={'icon'} variant={'outline'}>
                                    <span className='sr-only'>
                                        New Document
                                    </span>
                                    <FilePlus />
                                </Button>
                            </NewDocumentBtn>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className='h-[calc(100vh-10rem)]'>
                    {documents.length === 0 ? (
                        <div className='flex h-[calc(95vh-10rem)] flex-col items-center justify-center gap-3'>
                            <FileX size={64} className='shrink-0' />
                            <p className='text-lg text-muted-foreground'>
                                No documents found
                            </p>
                        </div>
                    ) : (
                        <ul className='flex flex-col gap-2 pt-2'>
                            {documents.map((doc) => (
                                <SidebarItem
                                    key={doc.id}
                                    document={doc}
                                    isOwner={doc.ownerId === user.id}
                                />
                            ))}
                        </ul>
                    )}
                </ScrollArea>
                <Separator />
                <UserInfoBtn user={user} />
            </SheetContent>
        </Sheet>
    )
}
