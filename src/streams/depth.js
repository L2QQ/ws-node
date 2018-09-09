const Big = require('big.js')

module.exports = class DepthStream {
    constructor(broker, commander) {
        this.broker = broker
        this.commander = commander
        setInterval(() => {
            this.onTick()
        }, 1000)
    }

    onTick() {
        this.commander.config().then((config) => {
            config.markets.forEach((market) => {
                this.commander.markets.depth(market.symbol).then((depth) => {
                    this.publish(market, depth)
                })
            })
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
