const { Broker, Dealer } = require('./src/streaming')
const streams = require('./src/streams')
const Commander = require('./src/commander')
const Trades = require('./src/trades')

const broker = new Broker()

const commander = new Commander(9040)
const trades = new Trades()

new streams.Depth(broker, commander)
new streams.Trade(broker, commander, trades)
new streams.Ticker(broker, commander, trades)
new streams.Kline(broker, commander, trades)
new streams.User(broker, commander, trades)

new Dealer(broker, {
    port: 9050,
    pingInterval: 1000,
    closingTimeout: 10000
})
