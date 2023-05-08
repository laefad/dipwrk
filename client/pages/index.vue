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
<VMain>
    <VContainer fluid class="fill-height">
        <VRow>
            <VCol
                v-if="streams.length == 0"
                cols="12"
            >
                <p class="text-h5 text-center">На текущий момент нет активных трансляций</p>
            </VCol>

            <VCol
                v-for="stream in streams"
                cols="3"
            >
                <VRow>
                    <p>{{ stream.name }}</p>
                </VRow>
                <VRow>
                    <p>{{ stream.category.name }}</p>
                </VRow>
                <VRow>
                    <p>{{ stream.streamer.name }}</p>
                </VRow>
            </VCol>
        </VRow>
    </VContainer>
</VMain>
</template>
