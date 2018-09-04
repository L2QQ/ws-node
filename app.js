const colors = require('colors')
const url = require('url')
const querystring = require('querystring')

const WebSocket = require('ws')

const wss = new WebSocket.Server({
    port: 9050
})

//const CLOSING_TIMEOUT = 24 * 60 * 60 * 1000     // 24 hours
//const PING_INTERVAL = 3 * 60 * 1000     // 3 minutes

const CLOSING_TIMEOUT = 10000
const PING_INTERVAL = 1000

/**
 * Pools
 */

var POOLS = {}

function broadcast(stream, data) {
    if (!POOLS[stream]) {
        return
    }

    POOLS[stream].forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            if (ws.isCombined) {
                ws.send(JSON.stringify({ stream, data }))
            } else {
                ws.send(JSON.stringify(data))
            }
        }
    })
}

/**
 * Listening
 */

wss.on('connection', (ws, req) => {
    setupAutoClosing(ws)
    setupPinging(ws)
    setupStreams(ws, req)
})

wss.on('listening', (ws) => {
    console.log(`Listening on ${wss.options.port}`)
})

/**
 * Parse streams
 */

function setupStreams(ws, req) {
    const parsed = url.parse(req.url)
    const [, type, stream] = (parsed.pathname || '').split('/')

    if (type === 'ws') {
        if (stream) {
            ws.isCombined = false
            ws.streams = [stream]
        } else {
            return ws.close(1008, 'Illegal format ws or stream')
        }
    } else if (type === 'stream') {
        const streams = (querystring.parse(parsed.query)['streams'] || '').split('/').filter(Boolean)
        if (streams.length > 0) {
            ws.isCombined = true
            ws.streams = [...new Set(streams)]
        } else {
            return ws.close(1008, 'Illegal format ws or stream')
        }
    } else {
        return ws.close(1008, 'Illegal format ws or stream')
    }

    for (const stream of ws.streams) {
        (POOLS[stream] || (POOLS[stream] = new Set())).add(ws)
    }

    ws.on('close', () => {
        for (const stream of ws.streams) {
            POOLS[stream].delete(ws)
        }
    })
}

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

/**
 * Streams
 */

 