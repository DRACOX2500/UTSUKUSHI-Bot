import { Activity } from '../Activity';
import { SoundEffect } from '../SoundEffect';

export interface BotCacheGlobal {
    activity?: Activity
    status?: string;
    soundEffects?: SoundEffect[]
}

export interface BotCacheGuild {
    lastPlayURL?: string | null,
    vocalNotifyChannel?: string | null
}