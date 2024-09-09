'use client'

import { User } from '@supabase/supabase-js'
import { Separator } from '@/components/ui/separator'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    updateProfileSchema,
    type UpdateProfileSchema,
} from '@/actions/user/schema'
import { ButtonLoading } from '../ui/button-loading'
import { SingleImageDropzone } from './image-upload'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { uploadFile } from '@/lib/utils'
import { updateProfile } from '@/actions/user'

export const ProfileForm = ({ user }: { user: User }) => {
    const [imagePreview, setImagePreview] = useState<File | string | undefined>(
        user.user_metadata.image,
    )
    const form = useForm<UpdateProfileSchema>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.user_metadata.name,
            image: user.user_metadata.image,
            email: user.email,
        },
    })

    const onSubmit = async (data: UpdateProfileSchema) => {
        const res = await updateProfile(data)
        if (!res.success) {
            return toast.error(res.error)
        }

        toast.success('Profile updated successfully!')
    }

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-medium'>Profile</h3>
                <p className='text-sm text-muted-foreground'>
                    This is how others will see you on the site.
                </p>
            </div>
            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='flex items-center justify-center'>
                        <SingleImageDropzone
                            height={200}
                            width={200}
                            className='rounded-full'
                            value={imagePreview}
                            onChange={async (img) => {
                                if (!img) {
                                    const client = createClient()
                                    toast.promise(
                                        client.storage
                                            .from('avatars')
                                            .remove([
                                                `${user.id}/${user.email}`,
                                            ]),
                                        {
                                            loading:
                                                'Deleting profile image...',
                                            success: ({ error }) => {
                                                if (error) {
                                                    return `${error.message}`
                                                }
                                                setImagePreview(undefined)
                                                return 'Profile image deleted.'
                                            },
                                        },
                                    )

                                    return setImagePreview(undefined)
                                }
                                setImagePreview(img)

                                toast.promise(
                                    uploadFile(
                                        img,
                                        user.id,
                                        user.email!,
                                        'avatars',
                                    ),
                                    {
                                        loading: 'Uploading profile image...',
                                        success: (data) => {
                                            if (data === '') {
                                                return 'Profile image upload failed.'
                                            }

                                            form.setValue('image', data)
                                            return 'Profile image uploaded.'
                                        },
                                    },
                                )
                            }}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Max' {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
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
                                        placeholder='example@mail.com'
                                        type='email'
                                        disabled
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Your email address cannot be changed.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ButtonLoading
                        type='submit'
                        isLoading={form.formState.isSubmitting}
                    >
                        Save Changes
                    </ButtonLoading>
                </form>
            </Form>
        </div>
    )
}
