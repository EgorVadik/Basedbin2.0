import { useCallback } from 'react'

export const useScrollIntoView = () => {
    const scrollIntoView = useCallback((element: HTMLElement | null) => {
        if (element != null) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
        }
    }, [])

    return {
        scrollIntoView,
    }
}
