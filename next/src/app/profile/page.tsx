import { getCurrentUser } from '@/actions/user'
import { ProfileForm } from '@/components/forms/profile-form'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page() {
    const res = await getCurrentUser()
    if (!res.success) notFound()
    const { user } = res.data

    return (
        <main>
            <ProfileForm user={user} />
        </main>
    )
}
