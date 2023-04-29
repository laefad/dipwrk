export type Leaf = 'right' | 'left'

export type PeerMessage = {
    type: 'newPeerLeaf' 
    leaf: Leaf
    peerId: string
} | {
    type: 'connectToStream'
} | {
    type: 'peerDisconnected'
    peerId: string
}
