const ytdl = require('@distube/ytdl-core');
const ytsr = require('ytsr');

const YOUTUBE_VIDEO_LINK = /(^https:\/\/www\.youtube\.com\/watch\?v=.+$)|(^https:\/\/youtu\.be\/$)/;

class YtbStream {

	constructor() {

		this.source = {
			title: '',
			url: '',
			duration: '',
			view: 0,
			found: null,
		};

		this.stream = null;
	}

	async init(url) {

		if (!url.match(YOUTUBE_VIDEO_LINK))
			await this.searchByKeyword(url);
		else
			this.setSource({ url: url });

		await this.getStreamSources()
			.then(
				(stream) => {
					this.stream = stream;
					if (this.stream)
						this.source.found = true;

					this.initEvents();
					return this;
				},
			);
	}

	getStreamSources() {
		return Promise.resolve(ytdl(this.source.url, { filter: 'audioonly', highWaterMark: 1 << 25 }));
	}

	async searchByKeyword(keyword) {
		const filter = await ytsr.getFilters(keyword)
			.then(
				(res) => {
					return res.get('Type').get('Video');
				},
			);
		const result = await ytsr(filter.url, { limit: 5 });
		if (result.results === 0) {
			this.source.found = false;
			return;
		}

		this.setSource(result.items[0]);
		return this.source.url;
	}

	setSource(object) {
		this.source.title = object.title || '';
		this.source.url = object.url || '';
		this.source.duration = object.duration || '';
		this.source.view = object.view || 0;
	}

	setInfoEvent(func) {
		if (this.stream)
			this.stream.on('info', func);
	}

	initEvents() {
		this.stream.on('error', error => {
			console.error('[Stream] Error:', error);
		});
	}

	get() {
		return this.stream;
	}

}

exports.YtbStream = YtbStream;