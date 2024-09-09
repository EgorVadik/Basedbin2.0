import React from 'react'
import { Button, ButtonProps } from './button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonLoadingProps = {
    isLoading?: boolean
    loadingClassName?: string
} & ButtonProps

export const ButtonLoading = ({
    isLoading,
    loadingClassName,
    ...props
}: ButtonLoadingProps) => {
    return (
        <Button {...props} disabled={isLoading}>
            {isLoading && (
                <Loader2
                    className={cn('mr-2 animate-spin', loadingClassName)}
                />
            )}
            {props.children}
        </Button>
    )
}
