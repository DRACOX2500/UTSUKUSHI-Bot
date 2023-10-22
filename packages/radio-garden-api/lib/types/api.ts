import { Channel, ChannelSourcePage, Page, Place, Search } from './business';

export interface RadioGardenResponse<T = any> {
	apiVersion: number;
	version: string;
	data: T;
}

export interface RadioGardenListResponse<T = any>
	extends Omit<RadioGardenResponse, 'data'> {
	data: {
		list: T[];
		version: string;
	};
}

export interface RadioGardenPagesResponse extends RadioGardenListResponse<Place> {}

export interface RadioGardenPageResult {
	type: string;
	count: number;
	map: string;
	title: string;
	subtitle: string;
	url: string;
	utcOffset: number;
	content: Page[];
}

export interface RadioGardenPageResponse extends RadioGardenResponse<RadioGardenPageResult> {}

export interface RadioGardenPageChannelsResult {
	count: number;
	map: string;
	title: string;
	subtitle: string;
	url: string;
	utcOffset: number;
	content: ChannelSourcePage[];
}

export interface RadioGardenPageChannelsResponse extends RadioGardenResponse<RadioGardenPageChannelsResult> {}

export interface RadioGardenChannelResponse extends RadioGardenResponse<Channel> {}

export interface RadioGardenSearchResponse {
	apiVersion: number;
	version: string;
	hits: {
		hits: Search[];
	};
	query: string;
	took: number;
}