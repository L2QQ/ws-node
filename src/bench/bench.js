const rp = require('request-promise-native')
rp({
    uri: `http://localhost:9040`,
    json: true
}).then((config) => {
    const symbols = config.markets.map(m => m.symbol)
    for (let i = 0; i < 100; ++i) {
        batchConnect(symbols)
    }
})

const colors = require('colors')
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
        console.log('WS Count:', wsCount)
    })

    ws.on('open', () => {
        wsCount += 1
        console.log('WS Count:', wsCount)
    })

    ws.on('message', () => {
        msgCount += 1
        console.log(wsCount, msgCount)
    })
}

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