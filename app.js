require('colors')
console.log('🐙 WS Server'.bold)

const { Broker, Dealer } = require('./src/streaming')
const streams = require('./src/streams')

const { Commander, Market, Account, UDS, Ticker, OHLCV } = require('../services-node/src/wrappers')
const Rabbit = require('../services-node/src/rabbit/rabbit')

const commander = new Commander(parseInt(process.env.COMMANDER_PORT) || 9040)
commander.on('config', (config) => {
    console.log('Config updated'.cyan)

    commander.services = {}
    commander.services.account = new Account(config.services.account.port)
    commander.services.market = new Market(config.services.market.port)
    commander.services.uds = new UDS(config.services.uds.port)
    commander.services.ticker = new Ticker(config.services.ticker.port)
    commander.services.ohlcv = new OHLCV(config.services.ohlcv.port)
})

commander.once('config', (config) => {
    console.log('Took config'.red)

    const broker = new Broker()
    const rabbit = new Rabbit()

    new streams.Depth(broker, commander)
    new streams.Trade(broker, commander, rabbit)
    new streams.Ticker(broker, commander)
    new streams.Kline(broker, commander)
    new streams.User(broker, commander, rabbit)
    new streams.Time(broker)

    const dealer = new Dealer(broker, {
        port: parseInt(process.env.PORT) || 9050
    })
    dealer.on('listening', () => {
        console.log('Listening on:', dealer.options.port.toString().green, '\n')
    })

    setInterval(() => {
        console.log(new Date())
        console.log('Sent messages:', broker.sentCount)
        console.log()
        broker.sentCount = 0
    }, 5000)
})
