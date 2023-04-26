export type StreamDevices = {
    videoInput: MediaDeviceInfo | null
    audioInput: MediaDeviceInfo | null
    audioOutput: MediaDeviceInfo | null
}

export const useMediaDevicesStore = defineStore('mediadevices', () => {

    const audioInputs = ref<MediaDeviceInfo[]>()
    const videoInputs = ref<MediaDeviceInfo[]>()
    const audioOutputs = ref<MediaDeviceInfo[]>()
    const mediaIsUnavailable = ref<boolean>(false)
    const devices = reactive<StreamDevices>({
        videoInput: null,
        audioInput: null,
        // not used yet
        audioOutput: null
    })
    const stream = ref<MediaStream | null>(null)

    // TODO need to use navigator.permissions.query 
    // but typescript doesnt have "camera" and "microphone" type definitions, only firefox types :( 
    const checkMediaPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({audio: true, video: true})
            mediaIsUnavailable.value = false
        } catch {
            mediaIsUnavailable.value = true
        }
    }

    const getMediaDevices = async () => {
        await checkMediaPermissions()
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()

        videoInputs.value = mediaDevices.filter(mdi => mdi.kind == 'videoinput')
        audioInputs.value = mediaDevices.filter(mdi => mdi.kind == 'audioinput')
        audioOutputs.value = mediaDevices.filter(mdi => mdi.kind == 'audiooutput')
    }

    if (getCurrentInstance()) {
        onMounted(() => {

            // Emitted when new device connected or disconnected
            navigator.mediaDevices.addEventListener('devicechange', () => {
                getMediaDevices()
            })

            getMediaDevices()

            // watch media sources and create media stream based on them
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

    return { mediaIsUnavailable, audioInputs, audioOutputs, videoInputs, devices, stream }
})
