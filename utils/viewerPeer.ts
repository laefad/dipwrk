import { MediaConnection, Peer } from 'peerjs'
import type { PeerMessage, Leaf } from './peerMessage'

export class ViewerPeer {

    // left and right leaves
    private _connections: {
        left: MediaConnection | null,
        right: MediaConnection | null
    }

    private _rootConnection: MediaConnection | null = null
    // media stream from root
    private _mediaStream: MediaStream | null = null

    constructor (
        private _peer: Peer,
        private _channelId: string
    ) {

        this._connections = {
            left: null,
            right: null
        }

        this._sendRequestToChannel()

        // wait somebody call us with stream media 
        this._peer.on('call', (mediaConnection) => {

            console.log(`Viewer called by ${mediaConnection.peer}`)

            this._rootConnection?.close()
            this._rootConnection = mediaConnection

            // close old connection if this is new root 
            if (mediaConnection.peer == this._connections.left?.peer) {
                this._connections.left.removeAllListeners()
                this._connections.left.close()
                this._connections.left = null
            }
            if (mediaConnection.peer == this._connections.right?.peer) {
                this._connections.right.removeAllListeners()
                this._connections.right.close()
                this._connections.right = null
            }
            
            mediaConnection.on('stream', (stream) => {
                console.log(`Stream recieved from ${mediaConnection.peer}`)
                // We call leaves mediastream update in setter
                this.mediaStream = stream
            })

            mediaConnection.on('close', () => {
                console.log(`Stream ended from root`)
                // Maybe close event emits after new stream ?
                // this.mediaStream = null
                // this._rootConnection = null
            })

            mediaConnection.answer()
            this.printState()

        })

        this._peer.on('connection', (connection) => {

            console.log(`${connection.peer} connected to viewer`)

            connection.on('data', (data) => {
                console.log(`Message from ${connection.peer}`)
                const typedData = data as PeerMessage

                if (typedData.type == 'newPeerLeaf') {
                    this._callLeafPeer(typedData.peerId, typedData.leaf)
                }

                connection.close()
            })
        })
    }

    private _sendRequestToChannel() {
        console.log(`Send request to channel ${this._channelId}`)
        const connection = this._peer.connect(this._channelId)

        connection.on('open', () => {
            connection.send({
                type: 'connectToStream'
            } as PeerMessage)

            console.log(`Message sended to ${this._channelId}`)
        })
    }

    //debug only
    private printState() {
        console.log({
            id: this._peer.id,
            root: this._rootConnection?.peer ?? null,
            left: this._connections.left?.peer ?? null,
            right: this._connections.right?.peer ?? null
        })
    }

    private _sendNotifyAboutDisconnect(peerId: string) {
        console.log(`Send notify about '${peerId}' disconnected to channel '${this._channelId}'`)
        const connection = this._peer.connect(this._channelId)

        connection.on('open', () => {
            connection.send({
                type: 'peerDisconnected',
                peerId
            } as PeerMessage)

            console.log(`Message 'peerDisconnected' from '${peerId}' sended to channel '${this._channelId}'`)
        })
    }

    private _callLeafPeer(peerId: string, leaf: Leaf) {
        console.log(`Viewer call ${leaf} leaf '${peerId}'`)

        if (this.mediaStream) {
            const mediaConnection = this._peer.call(peerId, this.mediaStream)
            this._connections[leaf] = mediaConnection

            mediaConnection.on('close', () => {
                console.log(`${leaf} leaf '${peerId}' diconnected`)
                this._connections[leaf] = null
                this._sendNotifyAboutDisconnect(peerId)
            })

            this.printState()
        } else {
            console.log(`NO MEDIA STREAM!`)
        }
    }

    // Getters/Setters

    public get mediaStream() {
        return this._mediaStream
    }

    public set mediaStream(newStream: MediaStream | null) {
        this._mediaStream = newStream
        if (this._connections.left) {
            this._callLeafPeer(this._connections.left.peer, 'left')
        }
        if (this._connections.right) {
            this._callLeafPeer(this._connections.right.peer, 'right')
        }
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