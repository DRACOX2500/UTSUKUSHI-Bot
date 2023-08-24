import { environment } from '../environment';
import { type PresenceStatusData } from 'discord.js';

export const TWITCH_LINK = 'https://www.twitch.tv/*';

export const ERROR_USERNAME = '#error#';
export const ERROR_COMMAND = 'Command Failed !';
export const ERROR_QUERY = 'Query Failed !';
export const ERROR_VOICE_CHANNEL = 'Voice channel not found';
export const ERROR_PLAYER_USED = 'Player is currently used';

export const ERROR_CMD_MESSAGE = '❌ Error 500 : Bip Boop... 🤖';
export const ERROR_CMD_GUILD = '❌ Guild not Found !';
export const ERROR_CMD_SONG = '❌ Song not Found !';
export const ERROR_CMD_SONG_DURATION = '❌ Song too long !';
export const ERROR_CMD_VC = '❌ You are not connected to a voice channel !';

export const DEFAULT_ACTIVITY = {
	status: 'idle' as PresenceStatusData,
	activity: {
		status: `version ${environment.APP_VERSION}`,
		code: 1,
		url: TWITCH_LINK,
	},
};