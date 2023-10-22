import axios, { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import {
	RadioGardenPageResponse,
	RadioGardenPagesResponse,
	RadioGardenPageResult,
	RadioGardenPageChannelsResponse,
	RadioGardenPageChannelsResult,
	RadioGardenChannelResponse,
	RadioGardenSearchResponse,
} from './types/api';
import { Channel, GeoLocation, Place, Search } from './types/business';
import { Readable } from 'stream';

const DOMAIN = 'https://radio.garden/api';

class RadioGarden {
	private readonly http: AxiosStatic;

	constructor() {
		this.http = axios;
	}

	private async get<T>(
		url: string,
		config?: AxiosRequestConfig<any>
	): Promise<T> {
		const res = await this.http.get(`${DOMAIN}${url}`, config);
		return res.data as T;
	}

	async getPlaces(): Promise<Place[]> {
		return (await this.get<RadioGardenPagesResponse>(`/ara/content/places`))
			.data.list;
	}

	async getPageByPlaceId(id: string): Promise<RadioGardenPageResult> {
		return (await this.get<RadioGardenPageResponse>(`/ara/content/page/${id}`))
			.data;
	}

	async getChannelsByPlaceId(
		placeID: string
	): Promise<RadioGardenPageChannelsResult> {
		return (
			await this.get<RadioGardenPageChannelsResponse>(
				`/ara/content/page/${placeID}/channels`
			)
		).data;
	}

	async getChannelById(id: string): Promise<Channel> {
		return (
			await this.get<RadioGardenChannelResponse>(`/ara/content/channel/${id}`)
		).data;
	}

	async getChannelMp3ById(channelID: string): Promise<string> {
		return await this.get<string>(
			`/ara/content/listen/${channelID}/channel.mp3`
		);
	}

	async search(query: string): Promise<Search[]> {
		return (
			await this.get<RadioGardenSearchResponse>(`/search/secure?q=${query}`)
		).hits.hits;
	}

	async listen(channelID: string): Promise<Readable> {
		return this.get<Readable>(`/ara/content/listen/${channelID}/channel.mp3`, {
			responseType: 'stream',
		});
	}

	async geo(): Promise<GeoLocation> {
		return this.get<GeoLocation>(`${DOMAIN}/geo`);
	}
}

export { RadioGarden };
