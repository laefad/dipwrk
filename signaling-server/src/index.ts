import { PeerServer } from 'peer'

const peerServer = PeerServer({ 
    port: 9000, 
    path: "/myapp",
}, (server) => {
    console.log('Server started at', server.address())
})

