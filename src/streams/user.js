const Big = require('big.js')

// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md
module.exports = class UserStream {
    constructor(broker, commander, rabbit) {
        this.broker = broker
        this.commander = commander
        this.rabbit = rabbit

        this.rabbit.on('order', this.onOrder.bind(this))
        this.rabbit.on('account', this.onAccount.bind(this))
    }

    onOrder(order) {
        this.commander.uds.listenKeyForUserId(order.userId).then((listenKey) => {
            if (listenKey) {
                this.publishOrderUpdate(listenKey, order)
            }
        })
    }

    onAccount(account) {
        this.commander.uds.listenKeyForUserId(account.id).then((listenKey) => {
            if (listenKey) {
                this.commander.accounts.account(account.id).then((account) => {
                    this.publishAccountUpdate(listenKey, account)
                })
            }
        })
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/user-data-stream.md#account-update
    publishAccountUpdate(listenKey, account) {
        this.broker.publish(listenKey, {
            e: 'outboundAccountInfo',
            E: Date.now(),
            m: 0,
            t: 0,
            b: 0,
            s: 0,
            T: true,
            W: true,
            D: true,
            u: Date.now(),
            B: [
                {
                    a: 'LTC',
                    f: '0.0',
                    l: '0.0'
                }
            ]
        })
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/user-data-stream.md#order-update
    publishOrderUpdate(listenKey, order) {
        this.broker.publish(listenKey, {
            e: 'executionReport',
            E: Date.now(),
            s: 'ETHBTC',
            c: '',
            S: 'BUY',
            o: 'LIMIT',
            f: 'GTC',
            q: '0',
            p: '0',
            P: '0',
            F: '0',
            g: -1,
            C: null,
            x: 'NEW',
            X: 'NEW',
            r: 'NONE',
            i: 32323,
            l: '0.0',
            z: '0',
            L: '0',
            n: '0',
            N: null,
            T: Date.now(),
            t: -1,
            I: 43434,
            w: true,
            m: false,
            M: false,
            O: Date.now(),
            Z: '0'
        })
    }
}
