const colors = require('colors')

// Test ws streams
const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:9050/stream?streams=ethusdt@trade/ethusdt@depth20')

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
    const json = JSON.parse(data)
    console.log(json.data)
    //console.log(typeof data)
})

ws.on('open', () => {
    console.log('🐒 open'.bold)
    ws.send('Hello')
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
