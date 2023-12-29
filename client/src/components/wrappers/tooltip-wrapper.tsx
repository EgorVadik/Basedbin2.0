import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export const TooltipWrapper = ({
    children,
    text,
    side,
}: {
    children: React.ReactNode
    text: string
    side?: 'top' | 'bottom' | 'left' | 'right'
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
