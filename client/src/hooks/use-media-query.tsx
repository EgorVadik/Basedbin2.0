import { useEffect, useState } from 'react'

export const useMediaQuery = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640)
            setIsTablet(window.innerWidth <= 1024)
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { isMobile, isTablet, windowWidth }
}
