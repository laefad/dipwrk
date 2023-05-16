<script lang="ts" setup>
import { useGetStreamsQuery } from '@/queries/generated'

const appBarStore = useAppBarStore()

const {
    result,
    error
} = useGetStreamsQuery()

const streams = computed(() => result.value?.streams ?? [])

onMounted(() => {
    appBarStore.title = 'Текущие трансляции'
})
</script>

<template>
<VContainer fluid class="fill-height">
    <VRow>
        <VCol
            v-if="streams.length == 0"
            cols="12"
        >
            <p class="text-h5 text-center">На текущий момент нет активных трансляций</p>
        </VCol>
        <VCol
            v-else
            v-for="stream in streams"
            cols="3"
        >
            <VCard
                :to="{path: '/stream/watch', query: {channelId: stream.id}}"
            >
                <p>{{ stream.name }}</p>
                <p>{{ stream.category.name }}</p>
                <p>{{ stream.streamer.name }}</p>
            </VCard>
        </VCol>
    </VRow>
</VContainer>
</template>
