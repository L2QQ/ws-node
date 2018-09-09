const URL = require('url')
const querystring = require('querystring')

module.exports = {
    parseStreams: (url) => {
        const parsed = URL.parse(url)
        const [, type, stream] = (parsed.pathname || '').split('/')

        if (type === 'ws') {
            if (stream) {
                return {
                    streams: [stream],
                    isCombined: false
                }
            } else {
                throw new Error('Need raw stream')
            }
        } else if (type === 'stream') {
            const streams = (querystring.parse(parsed.query)['streams'] || '').split('/').filter(Boolean)
            if (streams.length > 0) {
                return {
                    streams: [...new Set(streams)],
                    isCombined: true
                }
            } else {
                return new Error('Need combined streams')
            }
        } else {
            throw new Error('Need /ws or /stream in pathname')
        }
    }
}
