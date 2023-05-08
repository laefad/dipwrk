// Types
import type { ComputedRef, Ref } from 'vue'

// Composables
import { useLocalStorage } from '@vueuse/core'
import { useLoginMutation } from '@/queries/generated'

export const useTokenStore = defineStore('tokenstore', () => {
    const token = useLocalStorage<string>(AUTH_TOKEN, null)

    const { 
        mutate: loginMutate,
        loading,
        error
    } = useLoginMutation()

    const fetchNewToken = async (credentials: {
        username: string | Ref<string> | ComputedRef<string>,
        password: string | Ref<string> | ComputedRef<string>
    }) => {
        const result = await loginMutate({
            data: {
                name: getValue(credentials.username),
                password: getValue(credentials.password)
            }
        })
        token.value = result?.data?.login ?? null
    }

    const resetToken = () => {
        token.value = null
    }

    return {
        token,
        loading,
        error,
        resetToken,
        fetchNewToken,
    }
})
