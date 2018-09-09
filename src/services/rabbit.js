const EventEmitter = require('events')
const amqp = require('amqplib')

module.exports = class Rabbit extends EventEmitter {
    constructor() {
        super()
        this.connect()
    }

    async connect() {
        try {
            const conn = await amqp.connect('amqp://localhost')
            const ch = await conn.createChannel()
            this.consumeTrades(ch)
            this.consumeOrders(ch)
            this.consumeAccountUpdates(ch)
        } catch (err) {
            console.error(err)
        }
    }

    async consumeTrades(ch) {
        await ch.assertExchange('trades', 'fanout', { durable: false })
        const qok = await ch.assertQueue('', { exclusive: true })
        await ch.bindQueue(qok.queue, 'trades', '')
        ch.consume(qok.queue, (msg) => this.handleTrade(msg), { noAck: true })
    }

    async consumeOrders(ch) {
        await ch.assertExchange('orders', 'fanout', { durable: false })
        const qok = await ch.assertQueue('', { exclusive: true })
        await ch.bindQueue(qok.queue, 'orders', '')
        ch.consume(qok.queue, (msg) => this.handleOrder(msg), { noAck: true })
    }

    async consumeAccountUpdates(ch) {
        await ch.assertExchange('account', 'fanout', { durable: false })
        const qok = await ch.assertQueue('', { exclusive: true })
        await ch.bindQueue(qok.queue, 'account', '')
        ch.consume(qok.queue, (msg) => this.handleAccount(msg), { noAck: true })
    }

    handleTrade(msg) {
        this.handle(msg, 'trade')
    }

    handleOrder(msg) {
        this.handle(msg, 'order')
    }

    handleAccount(msg) {
        this.handle(msg, 'account')
    }

    handle(msg, event) {
        try {
            const json = JSON.parse(msg.content)
            this.emit(event, json)
        } catch (err) {
            console.error(err)
        }
    }
}
