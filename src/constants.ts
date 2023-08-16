import { DEFAULT_ACTIVITY } from "./core/constants";
import { UtsukushiSystem } from "./types/business";

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