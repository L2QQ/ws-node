const colors = require('colors')

const WebSocket = require('ws')

function verifyClient(info, callback) {
    console.log('🐙 verifyClient'.bold)
    callback(true)
}

const wss = new WebSocket.Server({
    port: 9050,
    verifyClient
})

//const CLOSING_TIMEOUT = 24 * 60 * 60 * 1000     // 24 hours
//const PING_INTERVAL = 3 * 60 * 1000     // 3 minutes

const CLOSING_TIMEOUT = 10000
const PING_INTERVAL = 1000

wss.on('connection', (ws, req) => {
    console.log('🐙 connection'.bold)
    console.log(req.url)

    ws.createdAt = new Date()
    setupPinging(ws)
    setupAutoClosing(ws)

    console.log(req.connection.remoteAddress)
    console.log(req.headers)
})

wss.on('listening', (ws) => {
    console.log('🐙 listening'.bold)
})

/**
 * Auto-closing
 */

function setupAutoClosing(ws) {
    ws.closingTimeout = setTimeout(() => {
        ws.close(4000, '24h auto closing')
    }, CLOSING_TIMEOUT)

    ws.on('close', () => {
        clearTimeout(ws.closingTimeout)
    })
}

/**
 * Ping
 */

function setupPinging(ws) {
    ws.isAlive = true
    ws.on('pong', () => {
        ws.isAlive = true
    })
}

setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            return ws.terminate()
        }

        ws.isAlive = false
        ws.ping()
    })
}, PING_INTERVAL)
