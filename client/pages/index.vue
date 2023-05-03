<script lang="ts" setup>

</script>
<template>
    <VMain>
        <VContainer fluid>
            <VList> 
                <VListItem>
                    <NuxtLink to="/stream/settings">Страница настройки трансляции</NuxtLink>
                </VListItem>
                <VListItem>
                    <NuxtLink to="/stream/watch">Страница просмотра трансляции</NuxtLink>
                </VListItem>
                <VListItem>
                    <NuxtLink to="/auth/login">Войти</NuxtLink>
                </VListItem>
                <VListItem>
                    <NuxtLink to="/auth/registration">Регистрация</NuxtLink>
                </VListItem>
            </VList>
        </VContainer>
    </VMain>
</template>
