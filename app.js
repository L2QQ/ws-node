const { Broker, Dealer } = require('./src/streaming')
const streams = require('./src/streams')
const Commander = require('./src/commander')
const Rabbit = require('./src/rabbit')

const broker = new Broker()

const commander = new Commander(9040)
const rabbit = new Rabbit()

new streams.Depth(broker, commander)
new streams.Trade(broker, commander, rabbit)
new streams.Ticker(broker, commander)
new streams.Kline(broker, commander)
new streams.User(broker, commander, rabbit)

new Dealer(broker, {
    port: 9050,
    pingInterval: 1000,
    closingTimeout: 10000
})
