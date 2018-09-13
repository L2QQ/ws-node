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

    async onOrder(order) {
        const listenKeys = await this.commander.services.uds.listenKeys(order.userId)
        this.publishOrderUpdate(listenKeys, order)
    }

    async onAccount(account) {
        const account = await this.commander.services.account.account(account.id)
        const listenKeys = await this.commander.services.uds.listenKeys(account.id) 
        this.publishAccountUpdate(listenKeys, account)
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/user-data-stream.md#account-update
    publishAccountUpdate(listenKeys, account) {
        account = {
            e: 'outboundAccountInfo',
            E: Date.now(),
            m: account.makerCommission,
            t: account.takerCommission,
            b: account.buyerCommission,
            s: account.sellerCommission,
            T: account.canTrade,
            W: account.canWithdraw,
            D: account.canDeposit,
            u: account.updateTime,
            B: account.balances.map(b => ({
                a: b.asset,
                f: Big(b.free).toFixed(8),
                l: Big(b.locked).toFixed(8)
            }))
        }
        listenKeys.forEach(listenKey => {
            this.broker.publish(listenKey, account)
        })
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/user-data-stream.md#order-update
    publishOrderUpdate(listenKeys, order) {
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
