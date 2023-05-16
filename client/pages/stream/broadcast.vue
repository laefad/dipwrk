<script lang="ts" setup>
// types
import type { Category } from '@/queries/generated'
import { SortOrder } from '@/queries/generated'
// composables
import { useEndStreamMutation, useStartStreamMutation, useGetAllCategoriesQuery } from '@/queries/generated'

import { mdiDice5Outline } from '@mdi/js'

definePageMeta({
    middleware: 'auth'
})

const mediaDevicesStore = useMediaDevicesStore()
const streamerPeer = useStreamerPeerStore()
const { currentUser } = toRefs(useAuthStore())
const appBarStore = useAppBarStore()
const appAlertsStore = useAppAlertsStore()
const uuidGenerator = ref(new UUID())

const {
    mutate: startStreamMutate
} = useStartStreamMutation()

const {
    mutate: stopStreamMutate
} = useEndStreamMutation()

const {
    result: categoriesQueryResult,
} = useGetAllCategoriesQuery({
    orderBy: {
        name: SortOrder.Asc
    } 
})

const uuid = ref(uuidGenerator.value.generate())
const streamName = ref('')
const category = ref<Pick<Category, '__typename' | 'id' | 'name'> | undefined>(undefined)
const online = ref(false)

const categories = computed(() => categoriesQueryResult.value?.categories ?? [])
const id = computed(() => `${currentUser.value!.id} ${uuid.value}`)

const generateUUID = () => {
    uuid.value = uuidGenerator.value.generate()
}

onMounted(() => {
    watch(online, (isOnline) => {
        if (isOnline) {
            appBarStore.title = 'Прямой эфир'
        } else {
            appBarStore.title = 'Настройка прямого эфира'
        }
    }, {
        immediate: true
    })
})

onBeforeUnmount(() => {
    onStreamEnd()
})

const onStreamEnd = () => {
    streamerPeer.disconnect()
    stopStreamMutate({where: {
        id: id.value
    }})
    online.value = false
}

const onStreamStart = async () => {
    if (mediaDevicesStore.stream != null) {
        streamerPeer.mediaStream = mediaDevicesStore.stream
        await streamerPeer.createPeerWithId(id.value)
        startStreamMutate({data: {
            id: id.value,
            name: streamName.value,
            streamer: {
                connect: {
                    id: currentUser.value!.id 
                }
            },
            category: {
                connect: {
                    id: category.value!.id
                }
            }
        }})
        online.value = true
    } else {
        appAlertsStore.addAlert({
            type: 'error',
            text: 'Отсутствует медиа-поток, проверьте выбраны ли медиа-устройства.'
        })
        online.value = false
    }
}

</script>

<template>
<VRow class="fill-height" align="center">
    <VCol cols="6">
        <StreamDeviceSelector />
        <VContainer fluid>
            <VTextField
                v-model="id"
                :append-icon="mdiDice5Outline"
                @click:append="generateUUID()"
                label="Ваш индентификатор"
                placeholder="Введите свой индентификатор"
                disabled
            />
            <VTextField
                v-model="streamName"
                label="Название трансляции"
                placeholder="Введите название трансляции"
            />
            <VSelect
                :items="categories"
                v-model="category"
                item-title="name"
                item-value="id"
                label="Категория трансляции"
                placeholder="Введите категорию трансляции"
                return-object
            />
        </VContainer>
        <VRow justify="center">
            <VBtn
                v-if="online"
                color="red"
                @click="onStreamEnd"
                text="Закончить трансляцию"
            />
            <VBtn 
                v-else
                color="green" 
                @click="onStreamStart"
                text="Начать трансляцию"
            />
        </VRow>
    </VCol>
    <VCol cols="6">
        <p class="text-center text-h3">
            Предпросмотр
        </p>
        <Player :stream="mediaDevicesStore.stream" :key="mediaDevicesStore.stream?.id"/>
    </VCol>
</VRow>
</template>
