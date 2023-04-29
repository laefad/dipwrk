// Types
import type { User } from '@prisma/client'
import type { UserLoginInput } from '@/models'
import type { PrismaClient } from '@prisma/client'

import { AuthenticationError } from 'apollo-server'

// Utils
import { sign, verify } from 'jsonwebtoken'
import { env } from 'process'

// TODO throw error?
const JWT_KEY = env.JWT_KEY ?? "dev-key"

export type UserInToken = Pick<User, 'id' | 'name' | 'role'>

export const generateToken = async (prisma: PrismaClient, userInput: UserLoginInput) => {

    const user = await prisma.user.findUnique({
        where: {
            name: userInput.name
        }
    })

    if (!user)
        throw new AuthenticationError('User with that name doesn\'t exist')

    if (userInput.password != user.password)
        throw new AuthenticationError('Wrong password')

    const payload: UserInToken = {
        id: user.id,
        name: user.name,
        role: user.role
    }

    return sign(
        payload,
        JWT_KEY,
        {
            algorithm: 'HS256',
            expiresIn: '7d'
        }
    )
}

export const getUser = (token: string) => {
    if (token == '')
        throw new AuthenticationError('No token provided')

    try {
        const user = verify(token, JWT_KEY)
        return user as UserInToken
    } catch {
        throw new AuthenticationError('Failed to authenticate token')
    }
}
