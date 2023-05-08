<script lang="ts" setup>
import { mdiEyeOff, mdiEye } from '@mdi/js'

const tokenStore = useTokenStore()
const appBarStore = useAppBarStore()

const showPassword = ref(false)
const username = ref("")
const password = ref("")

onMounted(() => {
    appBarStore.title = "Вход"
})

const onLogin = () => {
    tokenStore.fetchNewToken({
        username,
        password
    })
}
</script>

<template>
<VContainer class="fill-height">
    <VRow>
        <VCol cols="12">
            <VTextField
                density="comfortable"
                hide-details
                v-model="username"
                label="Имя пользователя"
                placeholder="Введите имя пользователя"
                :loading="tokenStore.loading"
            />
        </VCol>
        <VCol cols="11">
            <VTextField
                :type="showPassword ? 'text' : 'password'"
                density="comfortable"
                hide-details
                v-model="password"
                label="Пароль"
                placeholder="Введите пароль"
                :loading="tokenStore.loading"
            />
        </VCol>
        <VCol cols="1">
            <VCheckbox
                v-model="showPassword"
                :true-icon="mdiEyeOff"
                :false-icon="mdiEye"
                :loading="tokenStore.loading"
            />
        </VCol>
        <VCol cols="12" align="center">
            <VBtn
                @click="onLogin"
                :loading="tokenStore.loading"
                variant="outlined"
                text="Войти"
            />
        </VCol>
    </VRow>
</VContainer>  
</template>
