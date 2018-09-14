require('colors')
const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:9050/ws/time')

ws.on('close', (code, reason) => {
    console.log('close'.bold)
    console.log(code, reason)
})

ws.on('error', (err) => {
    console.log('error'.bold)
    console.error(err)
})

ws.on('upgrade', (req) => {
    console.log('upgrade'.bold)
})

ws.on('message', (data) => {
    const json = JSON.parse(data)
    console.log(json)
})

ws.on('open', () => {
    console.log('open'.bold)
})

ws.on('ping', (data) => {
    console.log('ping'.bold)
})

ws.on('pong', (data) => {
    console.log('pong'.bold)
})

ws.on('unexpected-response', (req, res) => {
    console.log('unexpected-response'.bold)
})
