// Composables
import { CurrentUserQuery, useCurrentUserLazyQuery } from '@/queries/generated'
import { storeToRefs } from 'pinia'

export const useAuthStore = defineStore('authstore', () => {

    const tokenStore = useTokenStore()
    const { resetToken: exit } = tokenStore
    const { token } = storeToRefs(tokenStore)

    const {
        loading,
        error,
        refetch: refetchUser,
        load,
        onResult
    } = useCurrentUserLazyQuery()

    const user = ref<CurrentUserQuery['getCurrentUser'] | null>(null)

    // Watch token changes and refetch current user
    if (getCurrentInstance()) {
        onMounted(() => {
            load()
            onResult((query) => {
                user.value = query.data?.getCurrentUser ?? null
            })
            watch(token, (newToken) => {
                if (!newToken || newToken == '') {
                    user.value = null
                } else {
                    refetchUser()?.then((query) => {
                        user.value = query.data?.getCurrentUser ?? null
                    })
                }
            })
        })
    }

    const currentUser = computed(() => user.value)
    const authenticated = computed(() => currentUser.value != null)

    return {
        authenticated,
        currentUser,
        loading,
        error,
        exit
    }
})
