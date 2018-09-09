require('colors')
console.log('🐙 WS Server'.bold)

const Commander = require('./src/services/commander')
const { Broker, Dealer } = require('./src/streaming')
const streams = require('./src/streams')
const Rabbit = require('./src/services/rabbit')

const commander = new Commander(parseInt(process.env.COMMANDER_PORT) || 9040)
commander.once('config', (config) => {
    console.log('Took config')

    const broker = new Broker()
    const rabbit = new Rabbit()

    //new streams.Depth(broker, commander)
    //new streams.Trade(broker, commander, rabbit)
    //new streams.Ticker(broker, commander)
    new streams.Kline(broker, commander)
    //new streams.User(broker, commander, rabbit)

    const dealer = new Dealer(broker, {
        port: parseInt(process.env.PORT) || 9050
    })
    dealer.on('listening', () => {
        console.log('Listening on:', dealer.options.port.toString().green)
    })
})
