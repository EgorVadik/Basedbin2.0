'use client'

import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, registerSchema } from '@/lib/validations'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

export const CreateAccount = () => {
    const callbackUrl = useSearchParams().get('callbackUrl')
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true)
        try {
            await axios.post('/api/register', data)
            const res = await signIn('credentials', {
                username: data.username,
                password: data.password,
                callbackUrl: callbackUrl ?? '/',
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 400:
                        toast.error('Invalid data please try again')
                        break
                    case 409:
                        toast.error('Email already in use')
                        break

                    default:
                        toast.error('Something went wrong please try again')
                        break
                }
            }
        } finally {
            setLoading(false)
        }
    })

    return (
        <Card>
            <form onSubmit={onSubmit}>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl'>
                        Create an account
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='username'>Username</Label>
                        <Input
                            id='username'
                            type='text'
                            placeholder='John Doe'
                            {...register('username')}
                            className={cn({
                                'border-red-500 dark:border-red-400':
                                    errors.username,
                            })}
                        />
                        {errors.username && (
                            <div className='text-sm text-red-500 dark:text-red-400'>
                                {errors.username.message}
                            </div>
                        )}
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input
                            id='password'
                            type='password'
                            placeholder='********'
                            {...register('password')}
                            className={cn({
                                'border-red-500 dark:border-red-400':
                                    errors.password,
                            })}
                        />
                        {errors.password && (
                            <div className='text-sm text-red-500 dark:text-red-400'>
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='confirmPassword'>
                            Confirm Password
                        </Label>
                        <Input
                            id='confirmPassword'
                            type='password'
                            placeholder='********'
                            {...register('confirmPassword')}
                            className={cn({
                                'border-red-500 dark:border-red-400':
                                    errors.confirmPassword,
                            })}
                        />
                        {errors.confirmPassword && (
                            <div className='text-sm text-red-500 dark:text-red-400'>
                                {errors.confirmPassword.message}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className='flex-col gap-2'>
                    <Button
                        className='flex w-full items-center gap-2'
                        type='submit'
                        disabled={loading}
                    >
                        {loading && <Loader2 className='animate-spin' />}
                        Create account
                    </Button>
                    <div className='text-sm'>
                        Already have an account?{' '}
                        <Link
                            href={
                                callbackUrl != null
                                    ? `/login?callbackUrl=${callbackUrl}`
                                    : '/login'
                            }
                            className={'underline'}
                        >
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
