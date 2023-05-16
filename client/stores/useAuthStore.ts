// Composables
import { useCurrentUserQuery } from '@/queries/generated'
import { storeToRefs } from 'pinia'

export const useAuthStore = defineStore('authstore', () => {

    const tokenStore = useTokenStore()
    const { resetToken: exit } = tokenStore
    const { token } = storeToRefs(tokenStore)

    const {
        result,
        loading,
        error,
        refetch: refetchUser,
    } = useCurrentUserQuery()

    // Watch token changes and refetch current user
    if (getCurrentInstance()) {
        onMounted(() => {
            watch(token, async () => {
                refetchUser()
            })
        })
    }

    const currentUser = computed(() => result.value?.getCurrentUser ?? null)
    const authenticated = computed(() => currentUser.value != null)

    return {
        authenticated,
        currentUser,
        loading,
        error,
        exit
    }
})
