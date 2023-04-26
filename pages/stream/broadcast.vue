<script lang="ts" setup>
const mediaDevicesStore = useMediaDevicesStore()
const streamerPeerStore = useStreamerPeerStore()
const router = useRouter()

onMounted(() => {
    if (mediaDevicesStore.stream == null || streamerPeerStore.peer == null) {
        router.push('/stream/settings')
    }
})

onBeforeUnmount(() => {
    streamerPeerStore.peer?.destroy()
    streamerPeerStore.peer = null
})
</script>


<template>
<VMain>
    <VRow class="fill-height" align="center">
        <VCol>
            <p class="text-center text-h3">
                Страница трансляции пира {{ streamerPeerStore.id }}
            </p>
            <Player :stream="mediaDevicesStore.stream" :key="mediaDevicesStore.stream?.id"/>
        </VCol>
    </VRow>
</VMain>
</template>
