const jayson = require('jayson/promise')

module.exports = class Account {
    constructor(port) {
        this.client = jayson.client.http({ port })
    }

    account(userId) {
        return this.request('account', { userId })
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
