const colors = require('colors')

const Commander = require('../../../services-node/src/services/wrappers/commander')
const commander = new Commander(parseInt(process.env.COMMANDER_PORT) || 9040)
commander.once('config', (config) => {
    const symbols = config.markets.map(m => m.symbol)
    for (let i = 0; i < 30; ++i) {
        batchConnect(symbols)
    }
})

const WebSocket = require('ws')

function batchConnect(symbols) {
    symbols.forEach((symbol) => {
        connect(`ws/${symbol.toLowerCase()}@depth5`)
        connect(`ws/${symbol.toLowerCase()}@depth10`)
        connect(`ws/${symbol.toLowerCase()}@depth20`)
        connect(`ws/${symbol.toLowerCase()}@trade`)
        connect(`ws/${symbol.toLowerCase()}@ticker`)
    })

    connect(`ws/!ticker@arr`)
    connect(`ws/!miniTicker@arr`)
}

var wsCount = 0
var msgCount = 0

function connect(path) {
    const ws = new WebSocket(`ws://localhost:9050/${path}`)

    ws.on('close', (code, reason) => {
        wsCount -= 1
        //console.log('WS Count:', wsCount)
    })

    ws.on('open', () => {
        wsCount += 1
        //console.log('WS Count:', wsCount)
    })

    ws.on('message', () => {
        msgCount += 1
        //console.log(wsCount, msgCount)
    })

    ws.on('error', (err) => {
        console.error(err)
    })
}

setInterval(() => {
    console.log(new Date())
    console.log('Opening web sockets:', wsCount)
    console.log('Received messages:', msgCount)
    console.log()
    msgCount = 0
}, 5000)

/*
Binance streams:

<symbol>@aggTrade
<symbol>@trade
<symbol>@kline_<interval>
<symbol>@miniTicker
!miniTicker@arr
<symbol>@ticker
!ticker@arr
<symbol>@depth<levels>
<symbol>@depth

*/