const EventEmitter = require('events')
const WebSocket = require('ws')
const utils = require('./utils')

module.exports = class Dealer extends EventEmitter {
    constructor(broker, options) {
        super()
        options = Object.assign({
            port: null,
            pingInterval: 3 * 60 * 1000,            // 3 minutes
            closingTimeout: 24 * 60 * 60 * 1000     // 24 hours
        }, options)

        this.broker = broker
        this.options = options

        this.wss = new WebSocket.Server({
            port: options.port
        })
        this.wss.on('connection', this.onConnection.bind(this))

        this.wss.on('listening', () => {
            this.emit('listening')
        })

        setInterval(() => {
            this.pingClients()
        }, options.pingInterval)
    }

    onConnection(ws, req) {
        try {
            this.parseStreams(ws, req)
            this.autoClose(ws)
            this.aliveOnPong(ws)
        } catch {
            ws.close(1008, 'Illegal format ws or stream')
        }
    }

    parseStreams(ws, req) {
        Object.assign(ws, utils.parseStreams(req.url))
        this.broker.subscribe(ws)
        ws.on('close', () => {
            this.broker.unsubscribe(ws)
        })
    }

    autoClose(ws) {
        ws.closingTimeout = setTimeout(() => {
            ws.close(4000, '24h auto closing')
        }, this.options.closingTimeout)

        ws.on('close', () => {
            clearTimeout(ws.closingTimeout)
        })
    }

    aliveOnPong(ws) {
        ws.isAlive = true
        ws.on('pong', () => {
            ws.isAlive = true
        })
    }

    pingClients() {
        this.wss.clients.forEach((ws) => {
            if (!ws.isAlive) {
                return ws.terminate()
            }

            ws.isAlive = false
            ws.ping()
        })
    }
}
