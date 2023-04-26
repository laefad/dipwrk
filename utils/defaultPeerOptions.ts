import type { PeerJSOption } from 'peerjs'

export const defaultPeerOptions: PeerJSOption = {
    debug: 0,
    host: "localhost",
    port: 9000,
    path: "/myapp"
}