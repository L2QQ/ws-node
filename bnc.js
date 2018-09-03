const WebSocket = require('ws')

const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade')

ws.on('close', (code, string) => {
    console.log('close')
    console.log(code, string)
})

ws.on('error', (err) => {
    console.log('error')
    console.log(err)
})

ws.on('upgrade', (request) => {
    console.log('upgrade')
    //onsole.log(request)
})

ws.on('message', (data) => {
    //console.log('message')
})

ws.on('open', () => {
    console.log('open')
})

ws.on('ping', (data) => {
    console.log('ping')
    console.log(data.length)
    console.log(data.toString('hex'))
    console.log(data.toString())
})

ws.on('pong', (data) => {
    console.log('pong')
})

ws.on('unexpected-response', (request, response) => {
    console.log('unexpected-response')
})
