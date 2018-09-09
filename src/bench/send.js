var amqp = require('amqplib');

// Send order to rabbitmq
amqp.connect('amqp://localhost').then(function (conn) {
    return conn.createChannel().then(function (ch) {
        var ex = 'trades';
        var ok = ch.assertExchange(ex, 'fanout', { durable: false })

        var message = process.argv.slice(2).join(' ') ||
            'info: Hello World!';



        return ok.then(function () {
            const buffer = Buffer.from(JSON.stringify({
                symbol: 'ETHUSDT',
                id: 323,
                price: '0.0323233',
                quantity: '4.2323',
                makerOrderId: 3,
                takerOrderId: 6,
                isBuyerMaker: true,
                time: Date.now()
            }))
            console.log(new Date())
            ch.publish(ex, '', buffer);
            console.log(" [x] Sent '%s'", message);
            return ch.close();
        });
    }).finally(function () { conn.close(); });
}).catch(console.warn);
