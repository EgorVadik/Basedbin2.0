'use server'

import { ReturnValue, ReturnValueWithData } from '@/types'
import {
    loginSchema,
    registerSchema,
    updateProfileSchema,
    type UpdateProfileSchema,
    type LoginSchema,
    type RegisterSchema,
} from './schema'
import { createClient } from '@/utils/supabase/server'
import { User } from '@supabase/supabase-js'
import { cache } from 'react'
import { prisma } from '@/server/db'
import { getErrorMessage, isPrismaError } from '@/lib/utils'

export const getCurrentUser = cache(
    async (): Promise<
        ReturnValueWithData<{
            user: User
        }>
    > => {
        try {
            const supabase = createClient()
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser()

            if (error) {
                return {
                    success: false,
                    error: error.message,
                }
            }

            if (user == null) {
                return {
                    success: false,
                    error: 'You need to be logged in to perform this action',
                }
            }

            return {
                success: true,
                data: {
                    user,
                },
            }
        } catch (error) {
            return {
                success: false,
                error: 'An error occurred while fetching user data',
            }
        }
    },
)

export const loginUser = async (
    loginData: LoginSchema,
): Promise<ReturnValue> => {
    try {
        const { email, password } = loginSchema.parse(loginData)
        const { success } = await getCurrentUser()
        if (success) {
            return {
                success: false,
                error: 'You are already logged in',
            }
        }

        const client = createClient()
        const { error } = await client.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        return {
            success: true,
        }
    } catch (error) {
        return {
            success: false,

            error: getErrorMessage(error),
        }
    }
}

export const createUser = async (
    registerData: RegisterSchema,
): Promise<ReturnValue> => {
    let id: string | undefined
    const client = createClient()

    try {
        const { email, name, password } = registerSchema.parse(registerData)

        const { success } = await getCurrentUser()
        if (success) {
            return {
                success: false,
                error: 'You are already logged in.',
            }
        }

        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        })

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        id = data.user?.id

        await prisma.user.create({
            data: {
                id,
                email,
                name,
            },
        })

        return {
            success: true,
        }
    } catch (error) {
        if (isPrismaError(error)) {
            await client.auth.admin.deleteUser(id!)
        }

        return {
            success: false,
            error: getErrorMessage(error),
        }
    }
}

export const logoutUser = async (): Promise<ReturnValue> => {
    try {
        const client = createClient()
        const { error } = await client.auth.signOut()

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        return {
            success: true,
        }
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error),
        }
    }
}

export const updateProfile = async (
    data: UpdateProfileSchema,
): Promise<ReturnValue> => {
    const client = createClient()

    try {
        const { name, image } = updateProfileSchema.parse(data)
        const res = await getCurrentUser()
        if (!res.success) {
            return {
                success: false,
                error: 'You need to be logged in to perform this action',
            }
        }

        const { user } = res.data

        const { error } = await client.auth.admin.updateUserById(user.id, {
            user_metadata: {
                name,
                image,
            },
        })

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name,
            },
        })

        return {
            success: true,
        }
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error),
        }
    }
}
