const jayson = require('jayson/promise')

module.exports = class Market {
    constructor(port) {
        this.client = jayson.client.http({ port })
    }

    depth(symbol, limit) {
        return this.request('depth', { symbol, limit })
    }

    trades(symbol, limit) {
        return this.request('trades', { symbol, limit })
    }

    bookTicker(symbol) {
        return this.request('bookTicker', { symbol })
    }

    priceTicker(symbol) {
        return this.request('priceTicker', { symbol })
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
