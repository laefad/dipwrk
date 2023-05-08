// Composables
import { useCurrentUserQuery } from '@/queries/generated'
import { storeToRefs } from 'pinia'

export const useAuthStore = defineStore('authstore', () => {

    const tokenStore = useTokenStore()
    const { resetToken: exit } = tokenStore
    const { token } = storeToRefs(tokenStore)

    const {
        result: userResult,
        loading,
        error,
        refetch: refetchUser
    } = useCurrentUserQuery()

    // Watch token changes and refetch current user
    watch(token, () => {
        refetchUser()
    })

    const currentUser = computed(() => userResult.value?.getCurrentUser ?? null)
    const authenticated = computed(() => currentUser.value != null)

    return {
        authenticated,
        currentUser,
        loading,
        error,
        exit
    }
})
