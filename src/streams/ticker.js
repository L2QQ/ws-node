const Big = require('big.js')
const jayson = require('jayson/promise')

module.exports = class TickerStream {
    constructor(broker, commander) {
        this.broker = broker
        this.commander = commander
        this.lastTinyMiniTickers = {}
        this.lastTinyFullTickers = {}

        setInterval(() => {
            this.tick()
        }, 1000)
    }

    tick() {
        this.commander.config().then((config) => {
            Promise.all(config.markets.map((market) => {
                return this.commander.tickers.ticker(market.symbol).then((ticker) => {
                    const mini = this.miniTicker(market, ticker)
                    const full = this.fullTicker(market, ticker)
                    this.publishMiniTicker(mini)
                    this.publishFullTicker(full)
                    return { mini, full }
                })
            })).then((res) => {
                this.publishMiniTickers(res.map(t => t.mini))
                this.publishFullTickers(res.map(t => t.full))
            })
        })
    }

    miniTicker(market, ticker) {
        return {
            e: '24hrMiniTicker',
            E: Date.now(),
            s: market.symbol,
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
            s: market.symbol
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

    publishMiniTicker(ticker) {
        this.broker.publish(`${ticker.s.toLowerCase()}@miniTicker`, ticker)
    }

    publishFullTicker(ticker) {
        this.broker.publish(`${ticker.s.toLowerCase()}@ticker`, ticker)
    }

    publishMiniTickers(tickers) {
        tickers = tickers.filter((t) => {
            const tiny = {
                c: t.c,
                o: t.o,
                h: t.h,
                l: t.l,
                v: t.v,
                q: t.q
            }
            const last = this.lastTinyMiniTickers[t.s]
            this.lastTinyMiniTickers[t.s] = tiny
            if (!last) {
                return true
            }
            return JSON.stringify(last) !== JSON.stringify(tiny)
        })
        this.broker.publish('!miniTicker@arr', tickers)
    }

    publishFullTickers(tickers) {
        tickers = tickers.filter((t) => {
            let tiny = Object.assign({}, t)
            delete tiny.e
            delete tiny.E
            delete tiny.s
            delete tiny.O
            delete tiny.C
            const last = this.lastTinyFullTickers[t.s]
            this.lastTinyFullTickers[t.s] = tiny
            if (!last) {
                return true
            }
            return JSON.stringify(last) !== JSON.stringify(tiny)
        })
        this.broker.publish('!ticker@arr', tickers)
    }
}
