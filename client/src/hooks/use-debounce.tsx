import { useCallback, useEffect } from 'react'

type DebounceOptions = {
    delay?: number
    deps: any[]
    effect: () => void
}

export const useDebounce = (
    { effect, delay, deps }: DebounceOptions = {
        delay: 500,
        deps: [],
        effect: () => {},
    },
) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const callback = useCallback(effect, deps)

    useEffect(() => {
        const timeout = setTimeout(callback, delay)
        return () => clearTimeout(timeout)
    }, [callback, delay])
}
