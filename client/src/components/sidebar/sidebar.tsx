import { Bot, Copy, HomeIcon, Info, UserCircle } from 'lucide-react'
import React from 'react'
import { ThemeButton } from '../buttons/theme-button'
import { TooltipWrapper } from '../wrappers/tooltip-wrapper'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { LogoutPopover } from '../popovers/logout-popover'
import { usePathname } from 'next/navigation'
import { Button, buttonVariants } from '../ui/button'
import { copyToClipboard } from '@/lib/utils'
import { ChatPopover } from '../popovers/chat-popover'
import { InfoPopover } from '../popovers/info-popover'

export const Sidebar = () => {
    const { data: session } = useSession()
    const pathname = usePathname().split('/')

    return (
        <div className='flex flex-col items-center justify-between border-r px-3 py-4'>
            <TooltipWrapper text='Home' side='right'>
                <Link
                    href='/'
                    className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon',
                    })}
                >
                    <HomeIcon size={24} />
                </Link>
            </TooltipWrapper>

            <div className='flex flex-col items-center gap-2'>
                {pathname.length > 2 && (
                    <>
                        <InfoPopover>
                            <TooltipWrapper text='Room Info' side='right'>
                                <Button variant='ghost' size='icon'>
                                    <Info size={24} />
                                </Button>
                            </TooltipWrapper>
                        </InfoPopover>

                        <TooltipWrapper text='Copy Room ID' side='right'>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() =>
                                    copyToClipboard(pathname.at(-1) ?? '')
                                }
                            >
                                <Copy size={24} />
                            </Button>
                        </TooltipWrapper>
                    </>
                )}
                {session != null && (
                    <>
                        <ChatPopover>
                            <TooltipWrapper text='Chat with bard' side='right'>
                                <Button variant='ghost' size='icon'>
                                    <Bot size={24} />
                                </Button>
                            </TooltipWrapper>
                        </ChatPopover>

                        <LogoutPopover>
                            <TooltipWrapper
                                text={session.user.username}
                                side='right'
                            >
                                <Button variant='ghost' size='icon'>
                                    <UserCircle size={24} />
                                </Button>
                            </TooltipWrapper>
                        </LogoutPopover>
                    </>
                )}

                <ThemeButton />
            </div>
        </div>
    )
}
