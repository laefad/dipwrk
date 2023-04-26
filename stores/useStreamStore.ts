export type StreamDevices = {
    videoInput: MediaDeviceInfo | null
    audioInput: MediaDeviceInfo | null
    audioOutput: MediaDeviceInfo | null
}

export const useStreamStore = defineStore('stream', () => {

    const devices = reactive<StreamDevices>({
        videoInput: null,
        audioInput: null,
        // not used yet
        audioOutput: null
    })
    const stream = ref<MediaStream | null>(null)

    // watch media sources and create media stream based on them
    if (getCurrentInstance()) {
        onMounted(() => {
            watch(devices, async () => {

                if (devices.audioInput != null && devices.videoInput != null) {
                    stream.value = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: {
                                exact: devices.audioInput.deviceId
                            }
                        },
                        video: {
                            deviceId: {
                                exact: devices.videoInput.deviceId
                            }
                        }
                    }) ?? null
                }
                
            })
        })
    }

    return { devices, stream }
})
