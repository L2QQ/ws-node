const rp = require('request-promise-native')

module.exports = class OHLCV {
    constructor(port) {
        this.port = port
    }

    /**
     * OHLCV bars
     * @param {string} symbol
     * @param {string} interval
     * @param {number} from unix timestamp (UTC) in milliseconds
     * @param {number} to unix timestamp (UTC) in milliseconds
     */
    bars(symbol, interval, from, to, limit) {
        return rp({
            uri: `http://localhost:${this.port}/ohlc`,
            qs: { symbol, interval, from, to, limit },
            json: true
        })
    }
}
