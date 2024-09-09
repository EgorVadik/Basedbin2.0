import { Status } from '@prisma/client'
import { z } from 'zod'

export const newDocumentSchema = z.object({
    title: z.string().min(2).max(50),
})

export type NewDocument = z.infer<typeof newDocumentSchema>

export const handleAccessRequestSchema = z.object({
    requestId: z.string().cuid(),
    status: z.enum([Status.ACCEPTED, Status.REJECTED]),
    documentId: z.string().cuid(),
})

export type HandleAccessRequest = z.infer<typeof handleAccessRequestSchema>

export const updateTitleSchema = z.object({
    title: z.string().min(2).max(50),
    documentId: z.string().cuid(),
})

export type UpdateTitle = z.infer<typeof updateTitleSchema>

export const inviteUserSchema = z.object({
    email: z.string().email(),
    documentId: z.string().cuid(),
})

export type InviteUser = z.infer<typeof inviteUserSchema>
