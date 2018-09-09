const Big = require('big.js')
const jayson = require('jayson/promise')

module.exports = class DepthStream {
    constructor(broker, commander) {
        this.broker = broker
        this.commander = commander
        this.start()
    }

    start() {
        this.interval = setInterval(() => {
            this.tick()
        }, 1000)
    }

    tick() {
        this.commander.config().then((config) => {
            config.markets.forEach((market) => {
                this.depth(market.symbol, config.depth.port).then((depth) => {
                    this.publish(market, depth)
                }).catch((err) => {
                    console.error(err)
                })
            })
        })
    }

    depth(symbol, port) {
        const client = jayson.client.http(`http://localhost:${port}`)
        return client.request('depth', { symbol: symbol }).then((res) => {
            if (res.error) {
                throw res.error
            }
            return res.result
        })
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#partial-book-depth-streams
    publish(market, depth) {
        function side(side) {
            return side.slice(0, 20).map(level => [
                Big(level[0]).toFixed(market.quotePrecision),
                Big(level[1]).toFixed(market.basePrecision),
                []
            ])
        }

        const bids = side(depth.bids)
        const asks = side(depth.asks)

        for (const level of [5, 10, 20]) {
            this.broker.publish(`${market.symbol.toLowerCase()}@depth${level}`, {
                lastUpdateId: depth.lastUpdateId,
                bids: bids.slice(0, level),
                asks: asks.slice(0, level)
            })
        }
    }
}
