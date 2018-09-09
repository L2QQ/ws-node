const EventEmitter = require('events')
const jayson = require('jayson/promise')

const Market = require('./market')
const Account = require('./account')
const UDS = require('./uds')
const Ticker = require('./ticker')
const OHLCV = require('./ohlcv')

module.exports = class Commander extends EventEmitter {
    constructor(port) {
        super()
        this.client = jayson.client.http({ port })
        this.services = {}
        this.loadConfig()
    }

    loadConfig() {
        this._config = this.client.request('config', null).then((res) => {
            if (res.error) {
                throw res.error
            }

            const config = res.result

            this.services.account = new Account(config.services.account.port)
            this.services.market = new Market(config.services.market.port)
            this.services.uds = new UDS(config.services.uds.port)
            this.services.ticker = new Ticker(config.services.ticker.port)
            this.services.ohlcv = new OHLCV(config.services.ohlcv.port)

            this.emit('config', res.result)
            return res.result
        }).catch((err) => {
            console.error(err)
        })
    }

    config() {
        return this._config
    }

    market(symbol) {
        return this.commander.config().then(config => {
            for (const market of config.markets) {
                if (market.symbol === symbol) {
                    return market
                }
            }
            throw new Error('Not found')
        })
    }
}
