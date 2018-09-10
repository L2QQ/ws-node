require('colors')
console.log('🐙 WS Server'.bold)

const { Broker, Dealer } = require('./src/streaming')
const streams = require('./src/streams')

const Commander = require('../services-node/src/services/wrappers/commander')
const Market = require('../services-node/src/services/wrappers/market')
const Account = require('../services-node/src/services/wrappers/account')
const UDS = require('../services-node/src/services/wrappers/uds')
const Ticker = require('../services-node/src/services/wrappers/ticker')
const OHLCV = require('../services-node/src/services/wrappers/ohlcv')

const Rabbit = require('../services-node/src/services/rabbit')

const commander = new Commander(parseInt(process.env.COMMANDER_PORT) || 9040)
commander.on('config', (config) => {
    console.log('Config updated'.cyan)

    commander.services.account = new Account(config.services.account.port)
    commander.services.market = new Market(config.services.market.port)
    commander.services.uds = new UDS(config.services.uds.port)
    commander.services.ticker = new Ticker(config.services.ticker.port)
    commander.services.ohlcv = new OHLCV(config.services.ohlcv.port)
})

commander.once('config', (config) => {
    console.log('Took config once'.red)

    const broker = new Broker()
    const rabbit = new Rabbit()

    new streams.Depth(broker, commander)
    new streams.Trade(broker, commander, rabbit)
    new streams.Ticker(broker, commander)
    new streams.Kline(broker, commander)
    new streams.User(broker, commander, rabbit)

    const dealer = new Dealer(broker, {
        port: parseInt(process.env.PORT) || 9050
    })
    dealer.on('listening', () => {
        console.log('Listening on:', dealer.options.port.toString().green)
    })
})
