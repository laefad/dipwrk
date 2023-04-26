<script lang="ts" setup>
import { StreamerPeer } from '@/utils/streamerPeer'

const streamStore = useStreamStore()
const streamerPeerStore = useStreamerPeerStore()
const router = useRouter()

onMounted(() => {

    if (streamStore.stream == null || streamerPeerStore.peer == null) {

        router.push('/stream/settings')

    } else  {

    }

})

// const showTree = () => {
//     console.log(
//         JSON.stringify(
//             peerTree.value, 
//             ['_left', '_right', '_root', 'value', 'id'],
//             '\t'
//         )
//     )
// }

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
            <Player :stream="streamStore.stream" :key="streamStore.stream?.id"/>
            <!-- <VBtn @click="showTree" color="green">
                Показать дерево
            </VBtn> -->
        </VCol>
    </VRow>
</VMain>
</template>
