import { AvlTree } from '@/utils/avl-tree/tree'
import { ChangeType, ChangesListener } from '~~/utils/avl-tree/treeChangesListener'
import Peer from 'peerjs'

// reversed standart compare
const reversedCompare = (time1: number, time2: number): number => {
    if (time1 > time2) {
        return -1
    }
    if (time1 < time2) {
        return 1
    }
    return 0
}

export const createPeerTree = (streamerPeer: Peer) => {
    return new AvlTree<number, PeerTreeData>(
        new Listener(streamerPeer),
        reversedCompare
    )
}
