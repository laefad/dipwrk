<script lang="ts" setup>
import { mdiEyeOff, mdiEye } from '@mdi/js'
import { useCreateUserMutation } from '@/queries/generated'

const tokenStore = useTokenStore()
const authStore = useAuthStore()
const appBarStore = useAppBarStore()

const showPassword = ref(false)
const username = ref("")
const password = ref("")

const router = useRouter()

onMounted(() => {
    appBarStore.title = "Регистрация"

    watch(ref(authStore.authenticated), () => {
        if (authStore.authenticated) 
            router.push({path: '/'})
    })
})

const {
    mutate: createUserMutate,
    loading,
    error,
} = useCreateUserMutation({})

const onRegister = async () => {
    const result = await createUserMutate({
        data: {
            name: username.value,
            password: password.value
        }
    })

    if (result?.data?.createOneUser?.id ?? "" != "") {
        tokenStore.fetchNewToken({username, password})
    }
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
                :loading="loading"
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
                :loading="loading"
            />
        </VCol>
        <VCol cols="1">
            <VCheckbox
                v-model="showPassword"
                :true-icon="mdiEyeOff"
                :false-icon="mdiEye"
                :loading="loading"
            />
        </VCol>
        <VCol cols="12" align="center">
            <VBtn
                @click="onRegister"
                :loading="loading"
                variant="outlined"
                text="Зарегистрироваться"
            />
        </VCol>
    </VRow>
</VContainer>   
</template>
