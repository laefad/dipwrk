<script lang="ts" setup>
import { mdiDice5Outline } from '@mdi/js'

const mediaDevicesStore = useMediaDevicesStore()
const streamerPeer = useStreamerPeerStore()
const appBarStore = useAppBarStore()

const id = ref("")
const noMediaStream = ref(false)
const uuid = ref(new UUID())

const generateUUID = () => {
    id.value = uuid.value.generate()
}

onMounted(() => {
    appBarStore.title = 'Настройка прямого эфира'
})

const onStreamStart = async () => {
    if (mediaDevicesStore.stream != null) {
        noMediaStream.value = false
        streamerPeer.mediaStream = mediaDevicesStore.stream
        await streamerPeer.createPeerWithId(id.value)
        appBarStore.title = 'Прямой эфир'
    } else {
        noMediaStream.value = true
        appBarStore.title = 'Настройка прямого эфира'
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
                    :append-icon="mdiDice5Outline"
                    @click:append="generateUUID()"
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
