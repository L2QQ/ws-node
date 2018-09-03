const colors = require('colors')

const WebSocket = require('ws')
const wss = new WebSocket.Server({
    port: 9050,
    verifyClient: (info) => {
        console.log('🐙 verifyClient'.bold)
        return true
    }
}, () => {
    console.log('🐙 callback'.bold)
})

wss.on('connection', (ws, req) => {
    console.log('🐙 connection'.bold)

    ws.on('close', (code, reason) => {
        console.log('🐒 close'.bold)
        console.log(code, reason)
    })

    ws.on('error', (err) => {
        console.log('🐒 error'.bold)
        console.log(err)
    })

    ws.on('upgrade', (req) => {
        console.log('🐒 upgrade'.bold)
    })

    ws.on('message', (data) => {
        console.log('🐒 message'.bold)
    })

    ws.on('open', () => {
        console.log('🐒 open'.bold)
    })

    ws.on('ping', (data) => {
        console.log('🐒 ping'.bold)
    })

    ws.on('pong', (data) => {
        console.log('🐒 pong'.bold)
    })

    ws.on('unexpected-response', (req, res) => {
        console.log('🐒 unexpected-response'.bold)
    })
})

wss.on('error', (err) => {
    console.log('🐙 error'.bold)
    console.error(err)
})

wss.on('headers', (headers, req) => {
    console.log('🐙 headers'.bold)
    console.log(headers)
})

wss.on('listening', (ws) => {
    console.log('🐙 listening'.bold)
})
