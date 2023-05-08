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
<VMain>
    <VContainer class="fill-height">
        <VCol>
            <VRow>
                <VCol>
                    <VTextField
                        density="comfortable"
                        hide-details
                        v-model="username"
                        label="Имя пользователя"
                        placeholder="Введите имя пользователя"
                        :loading="tokenStore.loading"
                    ></VTextField>
                </VCol>
            </VRow>
            <VRow>
                <VCol>
                    <VTextField
                        :type="showPassword ? 'text' : 'password'"
                        density="comfortable"
                        hide-details
                        v-model="password"
                        label="Пароль"
                        placeholder="Введите пароль"
                        :loading="tokenStore.loading"
                    ></VTextField>
                </VCol>
                <VCol align="center">
                    <VCheckbox
                        v-model="showPassword"
                        :true-icon="mdiEyeOff"
                        :false-icon="mdiEye"
                        :loading="tokenStore.loading"
                    ></VCheckbox>
                </VCol>
            </VRow>
            <VRow>
                <VCol cols="12">
                    <VBtn
                        @click="onLogin"
                        :loading="tokenStore.loading"
                    >
                        Войти
                    </VBtn>
                </VCol>
            </VRow>
        </VCol>
    </VContainer>
</VMain>    
</template>
