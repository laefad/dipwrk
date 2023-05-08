<script lang="ts" setup>
import { mdiDice5Outline } from '@mdi/js'

definePageMeta({
    middleware: 'auth'
})

const mediaDevicesStore = useMediaDevicesStore()
const streamerPeer = useStreamerPeerStore()
const authStore = useAuthStore()
const appBarStore = useAppBarStore()
const appAlertsStore = useAppAlertsStore()
const router = useRouter()

const id = ref("")
const noMediaStream = ref(false)
const uuid = ref(new UUID())

const generateUUID = () => {
    id.value = uuid.value.generate()
}

onMounted(() => {
    appBarStore.title = 'Настройка прямого эфира'
})

onBeforeUnmount(() => {
    streamerPeer.disconnect()
})

const onStreamStart = async () => {
    if (mediaDevicesStore.stream != null) {
        noMediaStream.value = false
        streamerPeer.mediaStream = mediaDevicesStore.stream
        await streamerPeer.createPeerWithId(id.value)
        appBarStore.title = 'Прямой эфир'
    } else {
        noMediaStream.value = true
        appAlertsStore.addAlert({
            type: 'error',
            text: 'Отсутствует медиа-поток, проверьте выбраны ли медиа-устройства.'
        })
        appBarStore.title = 'Настройка прямого эфира'
    }
}
</script>

<template>
<VRow class="fill-height" align="center">
    <VCol>
        <StreamDeviceSelector />
        <VContainer fluid>
            <VTextField
                v-model="id"
                :append-icon="mdiDice5Outline"
                @click:append="generateUUID()"
                label="Введите свой индентификатор"
            />
        </VContainer>
        <VRow justify="center">
            <VBtn 
                color="green" 
                @click="onStreamStart"
                text="Начать трансляцию"
            />
        </VRow>
    </VCol>
    <VCol>
        <p class="text-center text-h3">
            Предпросмотр
        </p>
        <Player :stream="mediaDevicesStore.stream" :key="mediaDevicesStore.stream?.id"/>
    </VCol>
</VRow>
</template>
