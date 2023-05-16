export default defineNuxtRouteMiddleware((to, from) => {

    if (process.server) return

    const authStore = useAuthStore()
    const router = useRouter()

    if (!authStore.authenticated) {
        const appAlertsStore = useAppAlertsStore()
        appAlertsStore.addAlert({
            type: 'info',
            text: 'Вы должны быть аутенфицированы, чтобы начать прямой эфир'
        })

        router.push('/auth/login')
    }

})
