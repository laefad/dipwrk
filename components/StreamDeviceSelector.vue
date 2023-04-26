<script lang="ts" setup>
const streamStore = useStreamStore()

const videoInputs = ref<MediaDeviceInfo[]>([])
const audioInputs = ref<MediaDeviceInfo[]>([])
const audioOutputs = ref<MediaDeviceInfo[]>([])

const notifyAboutPermission = ref(false)

onMounted(async () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(async () => {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        videoInputs.value = mediaDevices.filter(mdi => mdi.kind == 'videoinput')
        audioInputs.value = mediaDevices.filter(mdi => mdi.kind == 'audioinput')
        audioOutputs.value = mediaDevices.filter(mdi => mdi.kind == 'audiooutput')
    }).catch(() => {
        notifyAboutPermission.value = true
    })
})

</script>
<template>
<VAlert 
    v-if="notifyAboutPermission" 
    type="warning"
>
    <VContainer fluid>
        <p class="text-center">
            Разрешите доступ к камере и микрофону для дальнейшей работы
        </p>
        <VImg>
            <template #placeholder>
                <p class="text-center">
                    Тут могла бы быть картинка
                </p>
            </template>
        </VImg>
    </VContainer>
</VAlert>
<VContainer fluid>
    <VSelect
        label="Выберите источник видео"
        v-model="streamStore.devices.videoInput"
        :items="videoInputs"
        item-title="label"
        item-value="deviceId"
        return-object
    ></VSelect>
    <VSelect
        label="Выберите источник аудио"
        v-model="streamStore.devices.audioInput"
        :items="audioInputs"
        item-title="label"
        item-value="deviceId"
        return-object
    ></VSelect>
    <VSelect
        label="Выберите устройство вывода аудио"
        v-model="streamStore.devices.audioOutput"
        :items="audioOutputs"
        item-title="label"
        item-value="deviceId"
        return-object
    ></VSelect>
</VContainer>
</template>
