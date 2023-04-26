<script lang="ts" setup>
const mediaDevicesStore = useMediaDevicesStore()
const streamerPeer = useStreamerPeer()
const router = useRouter()

const id = ref("")
const noMediaStream = ref(false)

const onStreamStart = async () => {
    if (mediaDevicesStore.stream != null) {
        noMediaStream.value = false
        streamerPeer.mediaStream = mediaDevicesStore.stream
        await streamerPeer.createPeerWithId(id.value)
        router.push('/stream/broadcast')
    } else {
        noMediaStream.value = true
    }
}
</script>

<template>
<VAlert
    :model-value="noMediaStream"
    type="warning"
>
    <VContainer fluid>
        <p class="text-center">
            Отсутствует медиа-поток, проверьте выбраны ли медиа-устройства.
        </p>
    </VContainer>
</VAlert>
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
            <Player :stream="mediaDevicesStore.stream" :key="mediaDevicesStore.stream?.id"/>
        </VCol>
    </VRow>
</VMain>
</template>
