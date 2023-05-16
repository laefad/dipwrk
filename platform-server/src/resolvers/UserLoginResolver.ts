// Types 
import { User as TypeGraphQlUser } from '@/generated'
import type { User } from '@prisma/client'
import { UserLoginInput } from '@/models'
import type { Context } from '@/types'
import type { GraphQLResolveInfo } from 'graphql'

// Decorators
import { Resolver, Ctx, Mutation, Arg, Query, Info } from 'type-graphql'

// Utils
import graphqlFields from 'graphql-fields'
import { 
    transformCountFieldIntoSelectRelationsCount, 
    transformInfoIntoPrismaArgs 
} from '@/generated/helpers'
import { generateToken, getUser } from '@/utils'


@Resolver(_of => TypeGraphQlUser)
export class UserLoginResolver {

    @Mutation(_returns => String)
    async login(
        @Ctx() { prisma }: Context,
        @Info() info: GraphQLResolveInfo,
        @Arg('data') args: UserLoginInput
    ): Promise<string | null> {
        const token = generateToken(prisma, args)
        return token
    }

    @Query(_returns => TypeGraphQlUser, {
        nullable: true
    })
    async getCurrentUser(
        @Ctx() { prisma, token }: Context,
        @Info() info: GraphQLResolveInfo
    ): Promise<User | null> {
        try {
            const { id } = getUser(token)
            // TODO I dont remember what this code is doing...
            // const { _count } = transformInfoIntoPrismaArgs(
            //     graphqlFields(info as any)
            // )
            return prisma.user.findUnique({
                where: {
                    id: id
                },
                // ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
            })
        } catch {
            return null
        }
    }
}
