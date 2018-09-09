
module.exports = class TickerStream {
    constructor(broker, commander, trades) {
        this.broker = broker
        this.commander = commander
        this.start()
    }

    start() {
        this.interval = setInterval(() => {
            this.tick()
        }, 1000)
    }

    tick() {
        this.commander.config().then((config) => {
            Promise.all(config.markets.map((market) => {
                return this.ticker(market.symbol).then((ticker) => {
                    const mini = this.miniTicker(market, ticker)
                    const full = this.fullTicker(market, ticker)
                    this.publishMini(mini)
                    this.publishFull(full)
                    return { mini, full }
                })
            })).then((res) => {
                this.publishFulls(res.map(t => t.full))
                this.publishMinis(res.map(t => t.mini))
            })
        })
    }

    miniTicker(market, ticker) {
        return {
            e: '24hrMiniTicker',
            E: Date.now(),
            s: '',
            c: '',
            o: '',
            h: '',
            l: '',
            v: '',
            q: ''
        }
    }

    fullTicker(market, ticker) {
        return {
            e: '24hrTicker',
            E: Date.now(),
            s: ''
        }


        /*

        {
            "e": "24hrTicker",  // Event type
            "E": 123456789,     // Event time
            "s": "BNBBTC",      // Symbol
            "p": "0.0015",      // Price change
            "P": "250.00",      // Price change percent
            "w": "0.0018",      // Weighted average price
            "x": "0.0009",      // Previous day's close price
            "c": "0.0025",      // Current day's close price
            "Q": "10",          // Close trade's quantity
            "b": "0.0024",      // Best bid price
            "B": "10",          // Best bid quantity
            "a": "0.0026",      // Best ask price
            "A": "100",         // Best ask quantity
            "o": "0.0010",      // Open price
            "h": "0.0025",      // High price
            "l": "0.0010",      // Low price
            "v": "10000",       // Total traded base asset volume
            "q": "18",          // Total traded quote asset volume
            "O": 0,             // Statistics open time
            "C": 86400000,      // Statistics close time
            "F": 0,             // First trade ID
            "L": 18150,         // Last trade Id
            "n": 18151          // Total number of trades
          }

          */
    }

    

    publishMini(ticker) {
        this.broker.publish(`${ticker.s.toLowerCase()}@miniTicker`, ticker)
    }

    publishFull(ticker) {
        this.broker.publish(`${ticker.s.toLowerCase()}@ticker`, ticker)
    }

    publishMinis(tickers) {
        this.broker.publish('!miniTicker@arr', tickers)
    }

    publishFulls(tickers) {
        this.broker.publish('!ticker@arr', tickers)
    }

    ticker(symbol) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(symbol)
            }, 1000)
        })
    }

    /*


    bongo() {
        this.broker.publish(`${symbol.toLowerCase()}@ticker`, {
            e: '24hrMiniTicker',
            E: Date.now(),
            s: '',
            c: '',
            o: '',
            h: '',
            l: '',
            v: '',
            q: ''
        })
        {
            "e": "24hrTicker",  // Event type
            "E": 123456789,     // Event time
            "s": "BNBBTC",      // Symbol
            "p": "0.0015",      // Price change
            "P": "250.00",      // Price change percent
            "w": "0.0018",      // Weighted average price
            "x": "0.0009",      // Previous day's close price
            "c": "0.0025",      // Current day's close price
            "Q": "10",          // Close trade's quantity
            "b": "0.0024",      // Best bid price
            "B": "10",          // Best bid quantity
            "a": "0.0026",      // Best ask price
            "A": "100",         // Best ask quantity
            "o": "0.0010",      // Open price
            "h": "0.0025",      // High price
            "l": "0.0010",      // Low price
            "v": "10000",       // Total traded base asset volume
            "q": "18",          // Total traded quote asset volume
            "O": 0,             // Statistics open time
            "C": 86400000,      // Statistics close time
            "F": 0,             // First trade ID
            "L": 18150,         // Last trade Id
            "n": 18151          // Total number of trades
          }
    }
    */
}
