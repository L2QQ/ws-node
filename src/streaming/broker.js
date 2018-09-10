const WebSocket = require('ws')

module.exports = class Broker {
    constructor() {
        this.channels = {}
        this.sentCount = 0
    }

    subscribe(ws) {
        for (const stream of ws.streams) {
            (this.channels[stream] || (this.channels[stream] = new Set())).add(ws)
        }
    }

    unsubscribe(ws) {
        for (const stream of ws.streams) {
            this.channels[stream].delete(ws)
        }
    }

    publish(channel, data) {
        if (!this.channels[channel]) {
            return
        }

        this.channels[channel].forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                if (ws.isCombined) {
                    ws.send(JSON.stringify({ stream: channel, data }))
                } else {
                    ws.send(JSON.stringify(data))
                }
                this.sentCount++
            }
        })
    }
}
