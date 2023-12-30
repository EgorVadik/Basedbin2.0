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
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { LoginSchema, loginSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export const LoginAccount = () => {
    const router = useRouter()
    const callbackUrl = useSearchParams().get('callbackUrl')
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const onSubmit = handleSubmit(async ({ username, password }) => {
        setLoading(true)
        try {
            const res = await signIn('credentials', {
                username,
                password,
                callbackUrl: callbackUrl ?? '/',
                redirect: false,
            })

            if (res?.error) {
                toast.error(res?.error)
                return
            }

            router.replace(callbackUrl ?? '/')
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong please try again later')
        } finally {
            setLoading(false)
        }
    })

    return (
        <Card>
            <form onSubmit={onSubmit}>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl'>
                        Login to your account
                    </CardTitle>
                    <CardDescription>
                        Enter your username below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='username'>Username</Label>
                        <Input
                            id='username'
                            type='username'
                            placeholder='John Doe'
                            {...register('username')}
                            className={cn({
                                'border-red-500 dark:border-red-400':
                                    errors.username,
                            })}
                        />
                        {errors.username && (
                            <p className='text-sm text-red-500 dark:text-red-400'>
                                {errors.username.message}
                            </p>
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
                            <p className='text-sm text-red-500 dark:text-red-400'>
                                {errors.password.message}
                            </p>
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
                        Login
                    </Button>
                    <div className='text-sm'>
                        {`Don't have an account? `}
                        <Link
                            href={
                                callbackUrl != null
                                    ? `/register?callbackUrl=${callbackUrl}`
                                    : '/register'
                            }
                            className={'underline'}
                        >
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
