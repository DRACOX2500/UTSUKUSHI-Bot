/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from 'dotenv';
import ytdl from '@distube/ytdl-core';
import ytsr from 'ytsr';
import {
	YOUTUBE_MOBILE_VIDEO_LINK_REGEX,
	YOUTUBE_VIDEO_LINK_REGEX,
} from 'src/constant';
import { YtVideoItem } from '@models/yt-video-item.model';
import { red } from 'ansicolor';
import { Getter } from '@utils/getter';

config({ path: '.env' });

export class YtbStream {
	video!: YtVideoItem;
	queryT!: number | undefined;

	isFound: boolean | null = null;

	private stream: any | null = null;

	async init(urlKeywords: string, interaction?: any): Promise<void> {
		if (!urlKeywords.match(YOUTUBE_VIDEO_LINK_REGEX))
			await this.searchByKeyword(urlKeywords);
		else {
			this.queryT = parseInt(Getter.urlQueryParam(urlKeywords, 't'));
			await this.setSource(urlKeywords);
		}

		await this.getStreamSources().then((stream: any) => {
			this.stream = stream;
			if (this.stream) this.isFound = true;

			this.initEvents(interaction);
		});
	}

	async getStreamSources(): Promise<any> {
		const quality = process.env.YTDL_CORE_QUALITY || 'lowest';
		return Promise.resolve(
			ytdl(this.video.url, {
				filter: 'audioonly',
				highWaterMark: 1 << 25,
				quality: quality,
			})
		);
	}

	async searchByKeyword(keyword: string): Promise<void> {
		const filter = await ytsr.getFilters(keyword).then((res) => {
			return res.get('Type')?.get('Video');
		});
		if (!filter?.url) return;

		const result = await ytsr(filter.url, { limit: 5 });
		if (result.results === 0) {
			this.isFound = false;
			return;
		}

		await this.setSource((<YtVideoItem>(<unknown>result.items[0])).url);
	}

	static async getYtVideoDataByURL(url: string): Promise<YtVideoItem> {
		let vId = '';
		if (url.match(YOUTUBE_MOBILE_VIDEO_LINK_REGEX))
			vId = url.split('https://youtu.be/')[1].split('&')[0].split('?')[0];
		else
			vId = url
				.split('https://www.youtube.com/watch?v=')[1]
				.split('&')[0]
				.split('?')[0];

		const res = await ytsr(`https://www.youtube.com/watch?v=${vId}`, {
			limit: 1,
		});
		return <YtVideoItem>(<unknown>res.items[0]);
	}

	async setSource(url: string): Promise<void> {
		this.video = await YtbStream.getYtVideoDataByURL(url);
	}

	setInfoEvent(func: Function): void {
		if (this.stream) this.stream.on('info', func);
	}

	initEvents(interaction?: any): void {
		this.stream.on('error', (error: Error) => {
			console.error(red(`[Stream] Error : ${error.message}`));
			if (interaction && error.message === 'Sign in to confirm your age')
				interaction.editReply(
					'🔞 Sorry, but I can\'t play age restricted videos !'
				);
		});
	}

	get(): any {
		return this.stream;
	}
}

exports.YtbStream = YtbStream;
