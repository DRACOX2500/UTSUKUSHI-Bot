import { Activity } from 'root/src/models/activity.model';
import { SoundEffect } from 'root/src/models/sound-effect.model';
import { APIMessageComponentEmoji } from 'discord.js';

export interface BotCacheGlobal {
	activity?: Activity;
	status?: string;
}

export type BotCacheGlobalSoundEffect = SoundEffect;

export type BotCacheGlobalGuildEmoji = APIMessageComponentEmoji;

export interface BotCacheGuild {
	lastPlayURL?: string | null;
	vocalNotifyChannel?: string | null;
	shareEmojis?: boolean;
}

export const initBotCacheGuild: BotCacheGuild = {
	lastPlayURL: null,
	vocalNotifyChannel: null,
	shareEmojis: false,
};

export interface BotUserData {
	keywords: string[];
}

export const initBotUserData: BotUserData = {
	keywords: [],
};

export type BotUserDataKeyword = { keyword: string };

export type BotUserDataTypes = BotUserDataKeyword;