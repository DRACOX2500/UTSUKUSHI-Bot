
const ytdl = require('ytdl-core');

class YtbStream {

    constructor(url, options) {

        this.options = options || { message: true };
        this.stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 });
        this.initEvents();
    }

    setInfoEvent(func) {
        this.stream.on('info', func);
    }

    initEvents() {
        this.stream.on('error', error => {
            console.error('[Stream] Error:', error.message);
        });
    }

    get() {
        return this.stream;
    }

}

exports.YtbStream = YtbStream;