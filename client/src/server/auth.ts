import {
    type NextAuthOptions,
    type DefaultSession,
    getServerSession,
    User,
} from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/server/db'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string
            username: string
        } & DefaultSession['user']
    }
    interface User {
        id: string
        username: string
    }
    interface JWT {
        user: {
            id: string
            username: string
        } & DefaultSession['user']
    }
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET!,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { type: 'text' },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials?.username },
                })

                if (!user) {
                    throw new Error('Invalid Username')
                }

                if (credentials?.password == null)
                    throw new Error('Invalid password')

                const isValid = await compare(
                    credentials?.password,
                    user.password
                )
                if (!isValid) {
                    throw new Error('Invalid password')
                }

                return {
                    id: user.id,
                    username: user.username,
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user
            }
            return token
        },
        async session({ session, token }) {
            const user = token.user as User

            return {
                ...session,
                user: {
                    id: user.id,
                    username: user.username,
                },
            }
        },
    },
}

export const getServerAuthSession = () => getServerSession(authOptions)
