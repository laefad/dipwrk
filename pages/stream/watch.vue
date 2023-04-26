<script lang="ts" setup>
const viewerPeer = useViewerPeer()

onBeforeUnmount(() => {
    // reload to another page in site
    viewerPeer.disconnect()

    // page exit 
    window.addEventListener("beforeunload", () => {
        viewerPeer.disconnect()
    })
})
</script>

<template>
<VMain>
    <VRow class="fill-height" align="center">
        <VCol>
            <VTextField
                label="введите ваш id"
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
