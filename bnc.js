const colors = require('colors')

const WebSocket = require('ws')

const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trades')

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
    console.log(new Date())
})

ws.on('ping', (data) => {
    console.log('🐒 ping'.bold)
    console.log(new Date())
})

ws.on('pong', (data) => {
    console.log('🐒 pong'.bold)
})

ws.on('unexpected-response', (req, res) => {
    console.log('🐒 unexpected-response'.bold)
})
