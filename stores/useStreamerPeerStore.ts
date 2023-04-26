// Utils
import { Peer } from 'peerjs'
import { StreamerPeer } from '@/utils/streamerPeer'

export const useStreamerPeerStore = defineStore('streamerPeer', () => {
    const peer = ref<Peer | null>(null)
    const streamerPeer = ref<StreamerPeer | null>(null)

    const id = computed(() => peer.value?.id ?? null)

    const createPeerWithId = async (id: string, mediaStream: MediaStream) => {
        // const peerjs = (await import('peerjs')).default

        if (peer.value != null)
            peer.value.destroy()

        const p = new Peer(id, defaultPeerOptions)
        peer.value = p
        streamerPeer.value = new StreamerPeer(p, mediaStream)
    }

    return { peer, streamerPeer, id, createPeerWithId }
})
