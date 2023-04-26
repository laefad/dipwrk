<script lang="ts" setup>
const streamStore = useStreamStore()
const streamerPeer = useStreamerPeerStore()
const router = useRouter()

const id = ref("")

const onStreamStart = async () => {
    if (streamStore.stream != null) {
        await streamerPeer.createPeerWithId(id.value, streamStore.stream)
        router.push('/stream/broadcast')
    } else {
        alert('todo')
    }
}
</script>

<template>
<VMain>
    <VRow class="fill-height" align="center">
        <VCol>
            <StreamDeviceSelector />
            <VContainer fluid>
                <VTextField
                    v-model="id"
                    label="Введите свой индентификатор"
                ></VTextField>
            </VContainer>
            <VRow justify="center">
                <VBtn color="green" @click="onStreamStart">
                    Начать трансляцию
                </VBtn>
            </VRow>
        </VCol>
        <VCol>
            <p class="text-center text-h3">
                Предпросмотр
            </p>
            <Player :stream="streamStore.stream" :key="streamStore.stream?.id"/>
        </VCol>
    </VRow>
</VMain>
</template>
