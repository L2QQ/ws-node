//const CLOSING_TIMEOUT = 24 * 60 * 60 * 1000     // 24 hours
//const PING_INTERVAL = 3 * 60 * 1000     // 3 minutes

const CLOSING_TIMEOUT = 10000
const PING_INTERVAL = 1000

const Broker = require('./src/broker')
const broker = new Broker()

const Commander = require('./src/commander')
const commander = new Commander(9040)

const Trades = require('./src/trades')
const trades = new Trades()

const DepthStream = require('./src/streams/depth')
const TradeStream = require('./src/streams/trade')
const KlineStream = require('./src/streams/kline')
const TickerStream = require('./src/streams/ticker')
const UserStream = require('./src/streams/user')

new DepthStream(broker, commander)
new TradeStream(broker, commander, trades)
new KlineStream(broker, commander, trades)
new TickerStream(broker, commander, trades)
new UserStream(broker, commander, trades)

/**
 * WS Server
 */

const WebSocket = require('ws')
const wss = new WebSocket.Server({
    port: 9050
})

wss.on('connection', (ws, req) => {
    setupAutoClosing(ws)
    setupPinging(ws)
    setupStreams(ws, req)
})

wss.on('listening', () => {
    console.log(`Listening on ${wss.options.port}`)
})

/**
 * Parse streams
 */

const utils = require('./src/utils')

function setupStreams(ws, req) {
    try {
        Object.assign(ws, utils.parseStreams(req.url))
        broker.subscribe(ws)
        ws.on('close', () => {
            broker.unsubscribe(ws)
        })
    } catch {
        ws.close(1008, 'Illegal format ws or stream')
    }
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
