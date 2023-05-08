<script lang="ts" setup>
import { mdiDice5Outline } from '@mdi/js'
const viewerPeer = useViewerPeerStore()

const route = useRoute()

onMounted(() => {
    viewerPeer.channelId = route.query.channelId as string ?? ''

    // page exit 
    window.addEventListener("beforeunload", async () => {
        await viewerPeer.sendDisconnectNotificationToChannel()
    })
})

onBeforeUnmount(async () => {
    // reload to another page in site
    await viewerPeer.sendDisconnectNotificationToChannel()
    viewerPeer.clear()
})

const uuid = ref(new UUID())

const generateUUID = () => {
    viewerPeer.selfId = uuid.value.generate()
}

</script>

<template>
<VMain>
    <VRow class="fill-height" align="center">
        <VCol>
            <VTextField
                label="введите ваш id"
                :append-icon="mdiDice5Outline"
                @click:append="generateUUID()"
                v-model="viewerPeer.selfId"
            ></VTextField>
            <VTextField
                label="введите id стрима"
                v-model="viewerPeer.channelId"
            ></VTextField>
            <VBtn
                @click="viewerPeer.connectToChannel"
            >
                Подключиться
            </VBtn>
        </VCol>
        <VCol>
            <Player :stream="viewerPeer.mediaStream" :key="viewerPeer.streamKey"/>
        </VCol>
    </VRow>
</VMain>
</template>
