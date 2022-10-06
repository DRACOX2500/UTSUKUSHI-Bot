/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from 'dotenv';
import ytdl from '@distube/ytdl-core';
import ytsr from 'ytsr';
import { StreamSource } from '../models/StreamSource';
import { YOUTUBE_VIDEO_LINK_REGEX } from '../utils/const';

config({ path: '.env' });

export class YtbStream {

	source: StreamSource = {
		title: '',
		url: '',
		duration: '',
		view: 0,
		found: null,
	};

	private stream: any | null = null;

	async init(urlKeywords: string, interaction?: any): Promise<void> {

		if (!urlKeywords.match(YOUTUBE_VIDEO_LINK_REGEX))
			await this.searchByKeyword(urlKeywords);
		else
			this.setSource({ url: urlKeywords });

		await this.getStreamSources()
			.then(
				(stream: any) => {
					this.stream = stream;
					if (this.stream)
						this.source.found = true;

					this.initEvents(interaction);
				},
			);
	}

	getStreamSources(): Promise<any> {
		const quality = process.env.YTDL_CORE_QUALITY || 'lowest';
		return Promise.resolve(ytdl(this.source.url, { filter: 'audioonly', highWaterMark: 1 << 25, quality: quality }));
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

	initEvents(interaction?: any): void {
		this.stream.on('error', (error: Error) => {
			console.error('[Stream] Error:', error.message);
			if (interaction && error.message === 'Sign in to confirm your age')
				interaction.editReply('🔞 Sorry, but I can\'t play age restricted videos !');
		});
	}

	get(): any {
		return this.stream;
	}

}

exports.YtbStream = YtbStream;