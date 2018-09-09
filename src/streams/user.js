const Big = require('big.js')
const jayson = require('jayson/promise')
const amqp = require('amqplib')

/*
Wait user event
Take valid listen key
Load user
send user to listen key

Wait order
Take valid listen key
Send order to listen key
*/

// https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md
module.exports = class UserStream {
    constructor(broker) {
        this.broker = broker
    }

    // https://github.com/binance-exchange/binance-official-api-docs/blob/master/user-data-stream.md#account-update
    publishAccountUpdate(listenKey) {
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
    publishOrderUpdate(listenKey) {
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

    account(userId) {

    }
}
