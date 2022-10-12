import { Activity } from '@models/Activity';
import { SoundEffect } from '@models/SoundEffect';
import { APIMessageComponentEmoji } from 'discord.js';

export interface BotCacheGlobal {
    activity?: Activity
    status?: string;
}

export type BotCacheGlobalSoundEffect = SoundEffect

export type BotCacheGlobalGuildEmoji = APIMessageComponentEmoji;

export interface BotCacheGuild {
    lastPlayURL?: string | null,
    vocalNotifyChannel?: string | null
}

export const initBotCacheGuild: BotCacheGuild = {
	lastPlayURL: null,
	vocalNotifyChannel: null,
};