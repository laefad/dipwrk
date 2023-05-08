export default defineNuxtRouteMiddleware((to, from) => {

    if (process.server) return

    const authStore = useAuthStore()

    if (!authStore.authenticated) {
        const appAlertsStore = useAppAlertsStore()
        appAlertsStore.addAlert({
            type: 'info',
            text: 'Вы должны быть аутенфицированы, чтобы начать прямой эфир'
        })

        return navigateTo('/auth/login')
    }

})
