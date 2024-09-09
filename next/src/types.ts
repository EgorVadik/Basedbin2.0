import type { Document } from '@prisma/client'

export type ReturnValue =
    | {
          success: true
      }
    | {
          success: false
          error: string
      }

export type ReturnValueWithData<T> =
    | {
          success: true
          data: T
      }
    | {
          success: false
          error: string
      }

export type CustomErrorMessages = {
    P2002?: string
    P2025?: string
    ZodError?: string
    Error?: string
}

export type DocumentWithDetails = Document & {
    _count: { users: number }
    owner: { id: string }
}
