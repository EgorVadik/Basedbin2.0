'use server'

import { prisma } from '@/server/db'
import { getCurrentUser } from '../user'
import { ReturnValue, ReturnValueWithData } from '@/types'
import { getErrorMessage } from '@/lib/utils'
import {
    handleAccessRequestSchema,
    newDocumentSchema,
    updateTitleSchema,
    inviteUserSchema,
    type HandleAccessRequest,
    type InviteUser,
    type UpdateTitle,
} from './schema'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { Liveblocks } from '@liveblocks/node'

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export const newDocument = async (
    title: string,
): Promise<ReturnValueWithData<{ id: string }>> => {
    try {
        const { title: parsedTitle } = newDocumentSchema.parse({ title })

        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data

        const document = await prisma.document.create({
            data: {
                title: parsedTitle,
                content: {},
                ownerId: user.id,
                users: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        })

        return {
            success: true,
            data: {
                id: document.id,
            },
        }
    } catch (error) {
        return {
            success: false,
            error: getErrorMessage(error),
        }
    }
}

export const requestAccess = async (
    documentId: string,
): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data
        const parsedDocumentId = z.string().cuid().parse(documentId)

        await prisma.accessRequest.create({
            data: {
                documentId: parsedDocumentId,
                userId: user.id,
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

export const retryRequestAccess = async (
    documentId: string,
): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data
        const parsedDocumentId = z.string().cuid().parse(documentId)

        const request = await prisma.accessRequest.findUnique({
            where: {
                documentId_userId: {
                    documentId: parsedDocumentId,
                    userId: user.id,
                },
            },
        })

        if (!request) {
            return {
                success: false,
                error: 'Request not found',
            }
        }

        if (request.status !== 'REJECTED') {
            return {
                success: false,
                error: 'Request is not rejected',
            }
        }

        await prisma.$transaction([
            prisma.accessRequest.delete({
                where: {
                    id: request.id,
                },
            }),
            prisma.accessRequest.create({
                data: {
                    documentId: parsedDocumentId,
                    userId: user.id,
                },
            }),
        ])

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

export const handleAccessRequest = async (
    data: HandleAccessRequest,
): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data

        const { requestId, status, documentId } =
            handleAccessRequestSchema.parse(data)

        const request = await prisma.accessRequest.findUnique({
            where: {
                id: requestId,
                documentId,
            },
            include: {
                document: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        })

        if (!request) {
            return {
                success: false,
                error: 'Request not found',
            }
        }

        const isOwner = request.document.ownerId === user.id

        if (!isOwner) {
            return {
                success: false,
                error: 'You are not authorized to handle this request',
            }
        }

        if (status === 'ACCEPTED') {
            await prisma.$transaction([
                prisma.accessRequest.update({
                    where: {
                        id: requestId,
                        status: 'PENDING',
                    },
                    data: {
                        status,
                    },
                }),
                prisma.document.update({
                    where: {
                        id: documentId,
                    },
                    data: {
                        users: {
                            connect: {
                                id: request.userId,
                            },
                        },
                    },
                }),
            ])
        } else {
            await prisma.accessRequest.update({
                where: {
                    id: requestId,
                    status: 'PENDING',
                },
                data: {
                    status,
                },
            })
        }

        return {
            success: true,
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            error: getErrorMessage(error),
        }
    }
}

export const removeUserFromDocument = async (
    documentId: string,
    userId: string,
): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data

        const parsedDocumentId = z.string().cuid().parse(documentId)
        const parsedUserId = z.string().uuid().parse(userId)

        const document = await prisma.document.findUnique({
            where: {
                id: parsedDocumentId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!document) {
            return {
                success: false,
                error: 'Document not found',
            }
        }

        const isOwner = document.ownerId === user.id

        if (!isOwner) {
            return {
                success: false,
                error: 'You are not authorized to remove users from this document',
            }
        }

        if (document.ownerId === parsedUserId) {
            return {
                success: false,
                error: 'You cannot remove the owner from the document',
            }
        }

        const isUserInDocument = document.users.some(
            (u) => u.id === parsedUserId,
        )

        if (!isUserInDocument) {
            return {
                success: false,
                error: 'User is not in this document',
            }
        }

        await prisma.$transaction([
            prisma.document.update({
                where: {
                    id: parsedDocumentId,
                },
                data: {
                    users: {
                        disconnect: {
                            id: parsedUserId,
                        },
                    },
                },
            }),
            prisma.accessRequest.delete({
                where: {
                    documentId_userId: {
                        documentId: parsedDocumentId,
                        userId: parsedUserId,
                    },
                },
            }),
        ])

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

export const updateTitle = async (data: UpdateTitle): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data
        const { title, documentId } = updateTitleSchema.parse(data)

        const document = await prisma.document.findUnique({
            where: {
                id: documentId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!document) {
            return {
                success: false,
                error: 'Document not found',
            }
        }

        if (document.users.every((u) => u.id !== user.id)) {
            return {
                success: false,
                error: 'You are not authorized to update the title of this document',
            }
        }

        await prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                title,
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

export const deleteDocument = async (
    documentId: string,
): Promise<ReturnValue> => {
    try {
        const supabase = createClient()
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data

        const parsedDocumentId = z.string().cuid().parse(documentId)
        const document = await prisma.document.findUnique({
            where: {
                id: parsedDocumentId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!document) {
            return {
                success: false,
                error: 'Document not found',
            }
        }

        if (document.ownerId !== user.id) {
            return {
                success: false,
                error: 'You are not authorized to delete this document',
            }
        }

        await Promise.all([
            prisma.document.delete({
                where: {
                    id: parsedDocumentId,
                },
            }),
            supabase.storage.from('uploads').remove([`${parsedDocumentId}/`]),
            liveblocks.deleteRoom(parsedDocumentId),
        ])

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

export const leaveDocument = async (
    documentId: string,
): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data

        const parsedDocumentId = z.string().cuid().parse(documentId)
        const document = await prisma.document.findUnique({
            where: {
                id: parsedDocumentId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!document) {
            return {
                success: false,
                error: 'Document not found',
            }
        }

        const isUserInDocument = document.users.some((u) => u.id === user.id)

        if (!isUserInDocument) {
            return {
                success: false,
                error: 'You are not in this document',
            }
        }

        await prisma.$transaction([
            prisma.document.update({
                where: {
                    id: parsedDocumentId,
                },
                data: {
                    users: {
                        disconnect: {
                            id: user.id,
                        },
                    },
                },
            }),
            prisma.accessRequest.delete({
                where: {
                    documentId_userId: {
                        documentId: parsedDocumentId,
                        userId: user.id,
                    },
                },
            }),
        ])

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

export const inviteUser = async (data: InviteUser): Promise<ReturnValue> => {
    try {
        const res = await getCurrentUser()
        if (!res.success) return res
        const { user } = res.data

        const { email, documentId } = inviteUserSchema.parse(data)
        const userToInvite = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!userToInvite) {
            return {
                success: false,
                error: 'User not found',
            }
        }

        const document = await prisma.document.findUnique({
            where: {
                id: documentId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!document) {
            return {
                success: false,
                error: 'Document not found',
            }
        }

        if (document.ownerId !== user.id) {
            return {
                success: false,
                error: 'You are not authorized to invite users to this document',
            }
        }

        if (document.users.some((u) => u.id === userToInvite.id)) {
            return {
                success: false,
                error: 'User is already in this document',
            }
        }

        await prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                users: {
                    connect: {
                        id: userToInvite.id,
                    },
                },
                accessRequests: {
                    create: {
                        userId: userToInvite.id,
                        status: 'ACCEPTED',
                    },
                },
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
