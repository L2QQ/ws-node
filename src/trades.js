const EventEmitter = require('events')
const amqp = require('amqplib')

module.exports = class Trades extends EventEmitter {
    constructor() {
        super()
        this.connect()
    }

    async connect() {
        try {
            const conn = await amqp.connect('amqp://localhost')
            const ch = await conn.createChannel()
            await ch.assertExchange('trades', 'fanout', { durable: false })
            const qok = await ch.assertQueue('', { exclusive: true })
            await ch.bindQueue(qok.queue, 'trades', '')
            ch.consume(qok.queue, (msg) => this.handle(msg), { noAck: true })
        } catch (err) {
            console.error(err)
        }
    }

    handle(msg) {
        try {
            const json = JSON.parse(msg.content)
            this.emit('trade', json)
        } catch(err) {
            console.error(err)
        }
    }
}
