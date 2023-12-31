import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must contain at least 2 characters',
    }),
    password: z.string().min(6, {
        message: 'Password must contain at least 6 characters',
    }),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z
    .object({
        username: z.string().min(2, {
            message: 'Username must contain at least 2 characters',
        }),
        password: z.string().min(6, {
            message: 'Password must contain at least 6 characters',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Password must contain at least 6 characters',
        }),
    })
    .refine(
        (data) => {
            return data.password === data.confirmPassword
        },
        {
            message: 'Passwords must match',
            path: ['confirmPassword'],
        },
    )

export type RegisterSchema = z.infer<typeof registerSchema>

export const singleValueSchema = z.object({
    value: z.string().min(1, {
        message: 'Value must contain at least 1 character',
    }),
})

export type SingleValueSchema = z.infer<typeof singleValueSchema>
