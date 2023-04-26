import type { MediaConnection, Peer } from 'peerjs'
import type { PeerTreeData } from './avl-tree/peerTreeData'
import type { Leaf, PeerMessage } from './peerMessage'
import { AvlTree } from './avl-tree/tree'
import { TreeChangesListener } from './avl-tree/treeChangesListener'

export const reversedCompare = (time1: number, time2: number): number => {
    if (time1 > time2) {
        return -1
    }
    if (time1 < time2) {
        return 1
    }
    return 0
}

export class StreamerPeer {

    private static inactivityTime = 10000

    private _listener: TreeChangesListener<PeerTreeData>
    private _peerTree: AvlTree<number, PeerTreeData>
    private _peerTreeDict: Map<string, PeerTreeData>

    private _connectionToRoot: MediaConnection | null = null

    constructor (
        private _peer: Peer,
        private _mediaStream: MediaStream | null
    ) {
        this._listener = new TreeChangesListener()
        this._peerTree = new AvlTree(this._listener, reversedCompare)
        this._peerTreeDict = new Map()

        // peer init

        this._peer.on('connection', (connection) => {

            console.log(`${connection.peer} connected to streamer`)

            connection.on('open', () => {
                console.log('connection open')
            })

            connection.on('error', (error) => {
                console.log('connection error', error)
            })

            connection.on('close', () => {
                console.log('connection close')
            })

            // connection.on('iceStateChanged', (state) => {
            //     console.log('icestateChanged', state)
            // })

            const anotherPeer: PeerTreeData = {
                id: connection.peer,
                connectionTime: Date.now()
            }

            const inactivityTimeout = setTimeout(() => {
                connection.close()
                console.log(`${connection.peer} disconnected via inactivity`)
            }, StreamerPeer.inactivityTime)

            connection.on('data', (data) => {
                console.log(`Message from ${connection.peer} recieved`)
                const typedData = data as PeerMessage

                if (typedData.type == 'connectToStream') {
                    this._onPeerConnect(anotherPeer)
                } else if (typedData.type == 'peerDisconnected') {
                    const peer = this._peerTreeDict.get(typedData.peerId)
                    if (peer) {
                        this._onPeerDisconnect(peer)
                    }
                }

                clearTimeout(inactivityTimeout)
                connection.close()
            })

        })

        // listener init

        const changesStore: {
            root: string | null
            leafs: Map<string, {
                left: string | null
                right: string | null
            }>
        } = {
            root: null,
            leafs: new Map()
        }

        const clearStore = () => {
            changesStore.root = null
            changesStore.leafs = new Map()
        }

        this._listener.on('root', (source, data) => {
            changesStore.root = data?.id ?? null
        })

        this._listener.on('left', (source, data) => {
            if (changesStore.leafs.has(source!.id)) {
                changesStore.leafs.get(source!.id)!.left = data?.id ?? null 
            } else {
                changesStore.leafs.set(source!.id, {
                    left: data?.id ?? null,
                    right: null
                })
            }
        })

        this._listener.on('right', (source, data) => {
            if (changesStore.leafs.has(source!.id)) {
                changesStore.leafs.get(source!.id)!.right = data?.id ?? null 
            } else {
                changesStore.leafs.set(source!.id, {
                    right: data?.id ?? null,
                    left: null
                })
            }
        })

        this._listener.on('updated', () => {
            for (const [peerId, leaf] of changesStore.leafs) {
                if (leaf.left)
                    this._sendPeerNewConnectionInfo(peerId, leaf.left, 'left')
                if (leaf.right)
                    this._sendPeerNewConnectionInfo(peerId, leaf.right, 'right')
            }
            if (changesStore.root)
                this._callRootPeer(changesStore.root)
            clearStore()
        })
    }

    //debug only
    private printState() {
        console.log(
            JSON.stringify(
                this._peerTree, 
                ['_left', '_right', '_root', 'value', 'id'],
                '\t'
            )
        )
    }

    private _onPeerConnect(anotherPeer: PeerTreeData) {
        console.log(`${anotherPeer.id} connected to network`)
        this._peerTreeDict.set(anotherPeer.id, anotherPeer)
        this._peerTree.insert(anotherPeer.connectionTime, anotherPeer)
        this.printState()
    }

    private _onPeerDisconnect(anotherPeer: PeerTreeData) {
        console.log(`${anotherPeer.id} disconnected from network`)
        this._peerTreeDict.delete(anotherPeer.id)
        this._peerTree.delete(anotherPeer.connectionTime)
        this.printState()
    }

    private _sendPeerNewConnectionInfo(anotherPeerId: string, peerIdToConnect: string, leaf: Leaf) {
        console.log(`Send ${anotherPeerId} info about need to connect ${peerIdToConnect} '${leaf}'`)
        const connection = this._peer.connect(anotherPeerId)
        connection.on('open', () => {
            connection.send({
                type: 'newPeerLeaf',
                peerId: peerIdToConnect,
                leaf
            } as PeerMessage)
            console.log(`Message 'newPeerLeaf' sended to '${anotherPeerId}' with '${peerIdToConnect}' '${leaf}'`)
        })
        this.printState()
    }

    private _callRootPeer(rootPeerId: string | null) {
        if (
            this._mediaStream != null && 
            rootPeerId != null
        ) {
            console.log(`Call root peer ${rootPeerId}`)
            this._connectionToRoot?.close()
            this._connectionToRoot = this._peer.call(rootPeerId, this._mediaStream)
            // todo listen root peer disconnect 
        } else {
            console.log(`No peers here`)
            this._connectionToRoot?.close()
            this._connectionToRoot = null
        }
    }

    // Getters/Setters

    public get mediaStream() {
        return this._mediaStream
    }

    public set mediaStream(newStream: MediaStream | null) {
        console.log(`On media stream changed`)
        this._mediaStream = newStream
        this._callRootPeer(this._peerTree.root?.value.id ?? null)
    }

}

// Ограничение на кол-во пиров ~256 https://stackoverflow.com/questions/16015304/webrtc-peer-connections-limit 

// стучим в канал со стримом
// если нам ответили, то запрашиваем пиров, подходящих для раздачи нам трансляции

// стучим в раздающие пиры, соединяемся, если место еще свободно
// уведомляем канал о перестроении сети, отключаемся 
// получаем от пира поток данных в push-режиме

// если раздающий отвалился, то уведомляем листья о перестроении и запрашиваем инфу у канала
// если раздающий вышел нормально, то получаем от него инфу, куда подключаться 

// если мы хотим выйти, то говорим каналу и рассылаем листьям пиров, куда им следует переподключится. 
// при отключении всех пиров или по истечении времени ожидания выходим