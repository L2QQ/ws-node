
const jayson = require('jayson/promise')

module.exports = class UserDataStreams {
    constructor(port) {
        this.client = jayson.client.http({ port })
    }

    createListenKey(userId) {
        return this.request('createListenKey', { userId })
    }

    keepAliveListenKey(userId, listenKey) {
        return this.request('keepAliveListenKey', { userId, listenKey })
    }

    closeListenKey(userId, listenKey) {
        return this.request('closeListenKey', { userId, listenKey })
    }

    listenKey(userId) {
        return this.request('listenKey', { userId })
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
