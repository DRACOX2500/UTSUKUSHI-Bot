/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ytdl from '@distube/ytdl-core';
import ytsr from 'ytsr';
import { StreamSource } from '../model/StreamSource';
import { YOUTUBE_VIDEO_LINK_REGEX } from '../utils/const';

export class YtbStream {

	source: StreamSource = {
		title: '',
		url: '',
		duration: '',
		view: 0,
		found: null,
	};

	private stream: any | null = null;

	async init(url: string): Promise<void> {

		if (!url.match(YOUTUBE_VIDEO_LINK_REGEX))
			await this.searchByKeyword(url);
		else
			this.setSource({ url: url });

		await this.getStreamSources()
			.then(
				(stream: any) => {
					this.stream = stream;
					if (this.stream)
						this.source.found = true;

					this.initEvents();
				},
			);
	}

	getStreamSources(): Promise<any> {
		return Promise.resolve(ytdl(this.source.url, { filter: 'audioonly', highWaterMark: 1 << 25 }));
	}

	async searchByKeyword(keyword: string) : Promise<void> {
		const filter = await ytsr.getFilters(keyword)
			.then(
				(res) => {
					return res.get('Type')?.get('Video');
				},
			);
		if (!filter?.url) return;

		const result = await ytsr(filter.url, { limit: 5 });
		if (result.results === 0) {
			this.source.found = false;
			return;
		}

		this.setSource(result.items[0]);
	}

	setSource(object: any): void {
		this.source.title = object.title || '';
		this.source.url = object.url || '';
		this.source.duration = object.duration || '';
		this.source.view = object.view || 0;
	}

	setInfoEvent(func: Function): void {
		if (this.stream)
			this.stream.on('info', func);
	}

	initEvents(): void {
		this.stream.on('error', (error: Error) => {
			console.error('[Stream] Error:', error);
		});
	}

	get(): any {
		return this.stream;
	}

}

exports.YtbStream = YtbStream;