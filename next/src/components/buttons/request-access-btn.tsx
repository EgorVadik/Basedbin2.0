'use client'

import { requestAccess, retryRequestAccess } from '@/actions/documents'
import { useState } from 'react'
import { toast } from 'sonner'
import { ButtonLoading } from '@/components/ui/button-loading'
import { useRouter } from 'next/navigation'

export const RequestAccessBtn = ({
    documentId,
    retry = false,
}: {
    documentId: string
    retry?: boolean
}) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleClick = async () => {
        setLoading(true)
        try {
            const res = await (retry
                ? retryRequestAccess(documentId)
                : requestAccess(documentId))
            if (!res.success) return toast.error(res.error)
            toast.success('Access request sent')
            router.refresh()
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <ButtonLoading onClick={handleClick} isLoading={loading}>
            Request access
            {retry && ' again'}
        </ButtonLoading>
    )
}
