module.exports = class TimeStream {
    constructor(broker) {
        this.broker = broker
        setInterval(() => {
            this.onTick()
        }, 1000)
    }

    onTick() {
        const date = new Date()
        this.broker.publish('time', {
            time: date.getTime(),
            iso: date.toISOString()
        })
    }
}
