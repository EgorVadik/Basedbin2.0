import { NewDocumentBtn } from '@/components/buttons/new-document-btn'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function page() {
    return (
        <main className='container flex grow flex-col items-center justify-center gap-2'>
            <h1 className='text-4xl font-semibold'>Basedbin</h1>
            <p>Get started by creating a new bin or selecting an old one</p>
            <NewDocumentBtn>
                <Button className='mt-2'>Create a new bin</Button>
            </NewDocumentBtn>
        </main>
    )
}
