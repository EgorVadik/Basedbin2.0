import { Prisma } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import type { CustomErrorMessages } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getErrorMessage(
    error: unknown,
    messages: CustomErrorMessages = {
        P2002: 'This action has already been performed.',
        P2025: 'The information provided was not valid.',
        ZodError: undefined,
        Error: 'Something went wrong. Please try again.',
    },
) {
    if (error instanceof z.ZodError) {
        return (
            messages.ZodError ?? error.errors.map((e) => e.message).join(', ')
        )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return messages.P2002 as string
        }

        if (error.code === 'P2025') {
            return messages.P2025 as string
        }
    }

    if (error instanceof Error) {
        return error.message
    }

    return messages.Error as string
}

export function isPrismaError(error: unknown) {
    return (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
    )
}

export function getUsernameFallback(name: string) {
    const nameArr = name.split(' ')
    if (nameArr.length === 1) return nameArr[0].slice(0, 2).toUpperCase()
    const [first, second] = nameArr
    return `${first[0]}${second[0]}`.toUpperCase()
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
    const s = saturation / 100
    const l = lightness / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0,
        g = 0,
        b = 0

    if (0 <= hue && hue < 60) {
        r = c
        g = x
        b = 0
    } else if (60 <= hue && hue < 120) {
        r = x
        g = c
        b = 0
    } else if (120 <= hue && hue < 180) {
        r = 0
        g = c
        b = x
    } else if (180 <= hue && hue < 240) {
        r = 0
        g = x
        b = c
    } else if (240 <= hue && hue < 300) {
        r = x
        g = 0
        b = c
    } else if (300 <= hue && hue < 360) {
        r = c
        g = 0
        b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

export function getUserCaretColor(
    userId: string,
    theme: 'dark' | 'light',
): string {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash) % 360
    let lightness: number, saturation: number

    if (theme === 'dark') {
        lightness = 70
        saturation = 80
    } else {
        lightness = 40
        saturation = 60
    }

    const hexColor = hslToHex(hue, saturation, lightness)
    return hexColor
}

export async function uploadFile(
    file: File,
    id: string,
    name: string,
    bucket: 'uploads' | 'avatars' = 'uploads',
) {
    const supabase = createClient()
    const { error, data } = await supabase.storage
        .from(bucket)
        .upload(`${id}/${name}`, file, {
            upsert: true,
        })

    if (error) {
        toast.error(error.message)
        return ''
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
}
