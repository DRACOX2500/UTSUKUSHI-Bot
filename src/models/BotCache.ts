import { Activity } from './Activity';

export type BotCacheGlobal = {
    activity: Activity;
}

export interface BotCacheGuild {
    lastPlayURL: string | null
    vocalNotifyChannel: string | null;
}

export type BotCacheGuildTypes = {
    lastPlayURL: string | null
} | {
    vocalNotifyChannel: string | null;
}