import { Activity } from 'root/src/models/activity.model';
import { SoundEffect } from 'root/src/models/sound-effect.model';
import { APIMessageComponentEmoji } from 'discord.js';

/**
 * Data structure in the database for the **Global** document
 */
export interface GlobalData {
	activity?: Activity;
	status?: string;
}
export type GlobalDataSoundEffect = SoundEffect;
export type GlobalDataEmoji = APIMessageComponentEmoji;

/**
 * Data structure in the database for the **Guild** document
 */
export interface GuildData {
	lastPlayURL?: string | null;
	vocalNotifyChannel?: string | null;
	shareEmojis?: boolean;
}

/**
 * Data structure in the database for the User document
 */
export interface UserData {
	keywords: string[];
}