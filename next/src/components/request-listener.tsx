'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

const supabase = createClient()

export const RequestListener = ({ documentId }: { documentId: string }) => {
    const router = useRouter()

    useEffect(() => {
        const accessRequests = supabase
            .channel(`public:access_requests:${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'access_requests',
                },
                async (payload) => {
                    const isCurrentDoc = payload.new.documentId === documentId
                    if (!isCurrentDoc) return
                    if (payload.new.status === 'REJECTED') {
                        toast.error('Your request has been rejected')
                    }

                    if (payload.new.status === 'ACCEPTED') {
                        toast.success('Your request has been accepted')
                    }

                    router.refresh()
                },
            )
            .subscribe()

        return () => {
            accessRequests.unsubscribe()
        }
    }, [])

    return <></>
}
