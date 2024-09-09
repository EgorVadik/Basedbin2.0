'use client'

import { registerSchema, type RegisterSchema } from '@/actions/user/schema'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { createUser } from '@/actions/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ButtonLoading } from '@/components/ui/button-loading'

export default function RegisterPage({
    searchParams: { callbackUrl },
}: {
    searchParams: { callbackUrl?: string | null }
}) {
    const router = useRouter()
    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    })

    const onSubmit = async (values: RegisterSchema) => {
        const res = await createUser(values)
        if (!res.success) {
            return toast.error(res.error)
        }

        router.replace(callbackUrl ?? '/documents')
        toast.success('Registered successfully.')
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Max'
                                        required
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        placeholder='m@example.com'
                                        required
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ButtonLoading
                        type='submit'
                        className='w-full'
                        isLoading={form.formState.isSubmitting}
                    >
                        Create an account
                    </ButtonLoading>
                </form>
            </Form>

            <div className='mt-4 text-center text-sm'>
                Already have an account?{' '}
                <Link
                    href={`/login${
                        callbackUrl != null ? `?callbackUrl=${callbackUrl}` : ''
                    }`}
                    className='underline'
                >
                    Sign in
                </Link>
            </div>
        </>
    )
}
