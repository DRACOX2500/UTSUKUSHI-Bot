export interface Place {
	size: number;
	id: string;
	geo: [number, number];
	url: string;
	boost: false;
	title: string;
	country: string;
}

export interface Page {
	itemsType: string;
	title: string;
	type: string;
	items: ChannelItem[];
	actionText?: string;
	actionPage?: ActionPage;
	rightAccessory?: string;
}

export interface ChannelSourcePage {
	page: {
		type: string;
		url: string;
		stream: string;
		title: string;
		count?: number;
		subtitle?: string;
	};
}

export interface ChannelItem {
	itemsType: string;
	title: string;
	type: string;
	items: ChannelSource[];
	actionText?: string;
	actionPage?: ActionPage;
}

export interface ChannelSource extends ChannelSourcePage {
	title: string;
	href: string;
	rightAccessory?: string;
}

export interface ActionPage {
	type: string;
	count: 55;
	map: string;
	subtitle: string;
	title: string;
	url: string;
}

export interface Channel {
	type: string;
	title: string;
	id: string;
	url: string;
	stream: string;
	website: string;
	secure: true;
	place: {
		id: string;
		title: string;
	};
	country: {
		id: string;
		title: string;
	};
}

export interface Search {
	_id: string;
	_score: number;
	_source: {
		code: string;
		stream?: string;
		subtitle: string;
		type: 'place' | 'channel' | 'country';
		title: string;
		secure?: boolean;
		url: string;
	};
}

export interface GeoLocation {
	city?: string;
	country_code?: string;
	country_name?: string;
	eu?: boolean;
	ip?: string;
	latitude?: number;
	longitude?: number;
	metro_code?: number;
	region_code?: string;
	region_name?: string;
	time_zone?: string;
	zip_code?: string;
}
