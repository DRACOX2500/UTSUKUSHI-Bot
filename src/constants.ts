import { DEFAULT_ACTIVITY } from "./core/constants";
import { UtsukushiSystem } from "./types/business";

export const REGEX_LINK = /https?:\/\/.+/;

export const CACHE_REPO = '.cache';

export const BOT_EVENTS = {
	DATABASE_CONNECTED: '@DatabaseConnected',
	READY: '@Ready',
	STORE_INIT: '@StoreInit'
}

export const LOGO_MUSIC_BLUE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/musical-notes_1f3b6.png';
export const LOGO_MUSIC_PURPLE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/multiple-musical-notes_1f3b6.png';
export const RED_FUEL_PUMP = 'https://em-content.zobj.net/source/google/350/fuel-pump_26fd.png';

export const AFTER_READY = 5000;

export const GITHUB_LINK = 'https://github.com/DRACOX2500/Discord-Bot';

export const PONG_SMASH_CHANCE = 100;
export const PONG_COLOR = {
	GREEN: 0x41df19,
	YELLOW: 0xdfd019,
	RED: 0xdf1919,
}

export const DEFAULT_SYSTEM: UtsukushiSystem = {
	emojis: [],
	soundEffects: [],
	activity: DEFAULT_ACTIVITY.activity,
	status: DEFAULT_ACTIVITY.status,
}

const YOUTUBE = 0xff0000;
const SPOTIFY = 0x18d860;
const SOUNDCLOUD = 0xf15b22;
const YOUTUBE_DARKER = 0xb50000;
const SPOTIFY_DARKER = 0x129141;
const SOUNDCLOUD_DARKER = 0xa9390e;
export const COLOR: any = {
    'youtube': YOUTUBE,
    'spotify': SPOTIFY,
    'soundcloud': SOUNDCLOUD,
    'youtube_dark': YOUTUBE_DARKER,
    'spotify_dark': SPOTIFY_DARKER,
    'soundcloud_dark': SOUNDCLOUD_DARKER
}
export const GIT_ASSETS = 'https://raw.githubusercontent.com/DRACOX2500/UTSUKUSHI-Bot/dev2.0/src/assets/'
export const MUSIC_BLUE = 'https://em-content.zobj.net/source/twitter/31/multiple-musical-notes_1f3b6.png';