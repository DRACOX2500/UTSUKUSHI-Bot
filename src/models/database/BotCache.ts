import { Activity } from '@models/Activity';
import { Emoji } from '@models/Emoji';
import { SoundEffect } from '@models/SoundEffect';

export interface BotCacheGlobal {
    activity?: Activity
    status?: string;
}

export type BotCacheGlobalSoundEffect = SoundEffect

export interface BotCacheGlobalGuildEmoji {
    guildId: number;
    emojiList: Emoji[];
}

export interface BotCacheGuild {
    lastPlayURL?: string | null,
    vocalNotifyChannel?: string | null
}

export const initBotCacheGuild: BotCacheGuild = {
	lastPlayURL: null,
	vocalNotifyChannel: null,
};