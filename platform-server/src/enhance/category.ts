import { ResolverActionsConfig, UserRole } from '@/generated';
import { Authorized } from 'type-graphql';

export const CategoryActionsMap: ResolverActionsConfig<'Category'> = {
    createManyCategory: [Authorized(UserRole.admin)],
    createOneCategory: [Authorized(UserRole.admin)],
    deleteManyCategory: [Authorized(UserRole.admin)],
    deleteOneCategory: [Authorized(UserRole.admin)],
    updateManyCategory: [Authorized(UserRole.admin)],
    updateOneCategory: [Authorized(UserRole.admin)],
    upsertOneCategory: [Authorized(UserRole.admin)]
};
