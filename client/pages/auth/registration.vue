<script lang="ts" setup>
import { mdiEyeOff, mdiEye } from '@mdi/js'
import { useCreateUserMutation } from '~~/queries/generated'

const authStore = useAuthStore()

const showPassword = ref(false)
const username = ref("")
const password = ref("")

const router = useRouter();
watch(ref(authStore.authenticated), () => {
  if (authStore.authenticated) 
    router.back()
});

const createUserMutation = useCreateUserMutation({});
const loading = computed(() => createUserMutation.loading.value);

const registerError = ref("");

const onRegister = async () => {
  registerError.value = "";

  const result = await createUserMutation.mutate({
    data: {
      name: username.value,
      password: password.value
    }
  }).catch(e => {
    registerError.value = e.message;
  })

  if (result?.data?.createOneUser?.id ?? "" != "") {
    authStore.fetchNewToken({username, password});
    registerError.value = "";
  }

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
                        :loading="loading"
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
                        :loading="loading"
                    ></VTextField>
                </VCol>
                <VCol align="center">
                    <VCheckbox
                        v-model="showPassword"
                        :true-icon="mdiEyeOff"
                        :false-icon="mdiEye"
                        :loading="loading"
                    ></VCheckbox>
                </VCol>
            </VRow>
            <VRow>
                <VCol cols="12">
                    <VBtn
                        @click="onRegister"
                        :loading="loading"
                    >
                        Зарегестрироваться 
                    </VBtn>
                </VCol>
            </VRow>
        </VCol>
    </VContainer>
</VMain>    
</template>
