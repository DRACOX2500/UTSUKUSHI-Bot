/* eslint-disable @typescript-eslint/no-namespace */
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
import { red } from 'ansicolor';
import { Readable } from 'stream';
import { ChatInputCommandInteraction } from 'discord.js';

config({ path: '.env' });

export interface AudioStream {
    getByUrl(url: string):Promise<any>;
    getByKeywords(keywords: string):Promise<any>;
}

export namespace YoutubeStream {
	export interface YtVideoItem {
		type: string;
		title: string;
		id: string;
		url: string;
		bestThumbnail: [];
		thumbnails: [][];
		isUpcoming: boolean;
		upcoming: null;
		isLive: boolean;
		badges: [];
		author: [];
		description?: string;
		views: number;
		duration: string;
		uploadedAt: string;
	}
	export class YoutubeAudioStream implements AudioStream {
		private async search(keyword: string): Promise<string> {
			const filter = await ytsr.getFilters(keyword).then((res) => {
				return res.get('Type')?.get('Video');
			});
			if (!filter?.url) return '';

			const result = await ytsr(filter.url, { limit: 5 });
			if (result.results === 0) {
				return '';
			}

			return (<YtVideoItem>(<unknown>result.items[0])).url;
		}

		private async getReadable(url: string): Promise<Readable> {
			const quality = process.env.YTDL_CORE_QUALITY || 'lowest';
			return Promise.resolve(
				ytdl(url, {
					filter: 'audioonly',
					highWaterMark: 1 << 25,
					quality: quality,
				})
			);
		}

		async getByUrl(url: string): Promise<{ url: string; readable: Readable }> {
			if (!url.match(YOUTUBE_VIDEO_LINK_REGEX))
				throw new Error('param <url> is not a valid URL');
			const readable = await this.getReadable(url);
			return { url: url, readable: readable };
		}
		async getByKeywords(
			keywords: string
		): Promise<{ url: string; readable: Readable }> {
			const url = await this.search(keywords);
			return this.getByUrl(url);
		}

		static async getDataByURL(url: string): Promise<YtVideoItem> {
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
	}

	export function attachEvent(
		readable: Readable,
		interaction: ChatInputCommandInteraction
	): void {
		readable.on('error', (error: Error) => {
			console.error(red(`[Stream] Error : ${error.message}`));
			if (interaction && error.message === 'Sign in to confirm your age')
				interaction.editReply(
					'🔞 Sorry, but I can\'t play age restricted videos !'
				);
		});
	}
}

// export namespace SpotifyStream {
// 	export class SpotifyAudioStream implements AudioStream {
// 		async getByUrl(url: string): Promise<{ url: string; readable: Readable }> {
// 			if (!url.match(SPOTIFY_TRACK_LINK_REGEX))
// 				throw new Error('param <url> is not a valid URL');
// 			const readable = await spdl(url);
// 			return { url: url, readable: readable };
// 		}
// 		getByKeywords(keywords: string): Promise<any> {
// 			throw new Error('Method not implemented.');
// 		}
// 	}
// }
