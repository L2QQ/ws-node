const jayson = require('jayson/promise')

module.exports = class Tickers {
    constructor(port) {
        this.client = jayson.client.http({ port })
    }

    ticker(symbol) {
        return this.request('ticker', { symbol })
    }

    request() {
        return this.client.request(...arguments).then((res) => {
            if (res.error) {
                throw res.error
            }
            return res.result
        })
    }
}
