import { DEFAULT_ACTIVITY } from "./core/constants";
import { UtsukushiSystem } from "./types/business";

export const CACHE_REPO = '.cache'

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