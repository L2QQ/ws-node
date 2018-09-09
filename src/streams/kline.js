const Big = require('big.js')

module.exports = class KlineStream {
    constructor(broker, commander) {
        this.broker = broker
        this.commander = commander
        setInterval(() => {
            this.onTick()
        }, 1000)
    }

    onTick() {
        // May be in the future!
    }
}
