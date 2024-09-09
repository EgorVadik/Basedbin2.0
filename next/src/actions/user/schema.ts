import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(6),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    image: z.string().url().optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
