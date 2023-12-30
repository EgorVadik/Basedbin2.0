'use client'

import { infoAtom } from '@/atoms'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useAtom } from 'jotai'

export const InfoPopover = ({ children }: { children: React.ReactNode }) => {
    const [info] = useAtom(infoAtom)

    return (
        <Popover>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent side='top'>
                {info.map((i) => (
                    <div key={i.username} className='py-2'>
                        <h3 className='text-lg font-bold'>{i.username}</h3>
                        <p>Editing Line Number: {i.lineNumber}</p>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    )
}
