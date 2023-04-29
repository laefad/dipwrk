<script lang="ts" setup>
const mediaDevicesStore = useMediaDevicesStore()
const streamerPeer = useStreamerPeer()
const router = useRouter()

onMounted(() => {
    if (mediaDevicesStore.stream == null || streamerPeer.destroyed ) {
        router.push('/stream/settings')
    }
})

onBeforeUnmount(() => {
    streamerPeer.disconnect()
})
</script>


<template>
<VMain>
    <VRow>
        <VCol>
            <p class="text-center text-h3">
                Страница трансляции пира {{ streamerPeer.id }}
            </p>
            <Player :stream="mediaDevicesStore.stream" :key="mediaDevicesStore.stream?.id"/>
        </VCol>
    </VRow>
    <VRow>
        <VCol align="center">
            <NuxtLink :to="{path: '/stream/watch', query: {'channelId': streamerPeer.id ?? ''}}">
                Ссылка на трансляцию
            </NuxtLink>
        </VCol>
    </VRow>
</VMain>
</template>
