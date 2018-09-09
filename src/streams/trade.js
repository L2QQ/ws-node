const Big = require('big.js')

module.exports = class TradeStream {
    constructor(broker, commander, rabbit) {
        this.broker = broker
        this.commander = commander
        this.rabbit = rabbit
        this.rabbit.on('trade', trade => this.publish(trade))
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#trade-streams
    publish(trade) {
        this.commander.market(trade.symbol).then((market) => {
            const [buyerOrderId, sellerOrderId] = (() => {
                if (trade.isBuyerMaker) {
                    return [trade.makerOrderId, trade.takerOrderId]
                } else {
                    return [trade.takerOrderId, trade.makerOrderId]
                }
            })()

            this.broker.publish(`${trade.symbol.toLowerCase()}@trade`, {
                e: 'trade',
                E: Date.now(),

                s: trade.symbol,
                t: trade.id,
                p: Big(trade.price).toFixed(market.quotePrecision),
                q: Big(trade.quantity).toFixed(market.basePrecision),
                b: buyerOrderId,
                a: sellerOrderId,
                T: trade.time,
                m: trade.isBuyerMaker,

                M: true // Ignore
            })
        })
    }
}
