<script lang="ts" setup>
import { mdiHome, mdiHuman } from '@mdi/js'

const authStore = useAuthStore()
const appBarStore = useAppBarStore()
</script>

<template>
    <VAppBar>
        <VBtn
            :icon="mdiHome"
            to="/"
        />
        <VBtn
            v-if="authStore.authenticated"
            to="/stream/broadcast"
            text="Начать трансляцию"
        />
        <VBtn
            v-if="authStore.authenticated"
            to="/stream/watch"
            text="Смотреть трансляцию"
        />

        <VSpacer/>
        <VAppBarTitle 
            align="center"
            :text="appBarStore.title"    
        />
        <VSpacer/>

        <template
            v-if="authStore.authenticated"
        >
            <VChip 
                :prepend-icon="mdiHuman"
                :text="authStore.currentUser?.name"
            />
            <VBtn
                @click="authStore.exit"
                text="Выйти"
            />
        </template>
        <template 
            v-else
        >
            <VBtn
                @click="authStore.exit"
                to="/auth/login"
                text="Войти"
            />
            <VBtn
                @click="authStore.exit"
                to="/auth/registration"
                text="Зарегистрироваться"
            />
        </template>
    </VAppBar>
</template>
