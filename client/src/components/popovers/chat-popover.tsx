import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { chatWithBard } from '@/actions'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Chat } from '@/types'
import { ScrollArea } from '../ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { useScrollIntoView } from '@/hooks/use-scroll-into-view'

export const ChatPopover = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Chat[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const lastElementRef = useRef<HTMLDivElement>(null)
    const { scrollIntoView } = useScrollIntoView()

    useEffect(() => {
        scrollIntoView(lastElementRef.current)
    }, [messages, scrollIntoView])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ message: string }>({
        defaultValues: {
            message: '',
        },
        resolver: zodResolver(
            z.object({
                message: z.string().min(1),
            }),
        ),
    })

    const onSubmit = handleSubmit(async ({ message }) => {
        setIsLoading(true)
        try {
            const data = await chatWithBard(messages, message)
            const newHistory = [
                {
                    role: 'user',
                    parts: message,
                },
                {
                    role: 'model',
                    parts: data,
                },
            ] as const

            setMessages((prev) => {
                return [...prev, ...newHistory]
            })
            reset()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    })

    return (
        <Popover>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className='flex w-full max-w-sm flex-col gap-5 sm:max-w-screen-sm'>
                <ScrollArea
                    ref={scrollAreaRef}
                    className='flex max-h-[30rem] flex-col gap-2'
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            ref={
                                index === messages.length - 1
                                    ? lastElementRef
                                    : null
                            }
                            className={`mb-4 flex flex-col gap-1 ${
                                message.role === 'user'
                                    ? 'items-start'
                                    : 'items-end'
                            }`}
                        >
                            {message.role === 'model' ? (
                                <ReactMarkdown
                                    className={
                                        'prose-mine prose rounded-md bg-muted px-4 py-2 max-sm:max-w-xs'
                                    }
                                >
                                    {message.parts}
                                </ReactMarkdown>
                            ) : (
                                <span
                                    className={
                                        'rounded-md bg-primary px-4 py-2 text-primary-foreground'
                                    }
                                >
                                    {message.parts}
                                </span>
                            )}
                        </div>
                    ))}
                </ScrollArea>
                <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                    <Input
                        {...register('message')}
                        placeholder='Message'
                        className={errors.message && 'border-red-500'}
                    />
                    {errors.message && (
                        <span className='text-red-500'>
                            {errors.message.message}
                        </span>
                    )}
                    <Button
                        disabled={isLoading}
                        className='flex w-full items-center gap-2'
                        onClick={(e) => {}}
                    >
                        {isLoading && <Loader2 className='animate-spin' />}
                        Chat with bard
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    )
}
