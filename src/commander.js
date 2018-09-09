const rp = require('request-promise-native')

module.exports = class Commander {
    constructor(port) {
        this.port = port
        this.loadConfig()
    }

    loadConfig() {
        this._config = rp({
            uri: `http://localhost:${this.port}`,
            json: true
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
