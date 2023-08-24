import { type BotActivity, type BotConfig } from '../core/types/business';
import { type PresenceStatusData } from 'discord.js';

export interface PrivateiInteraction {
    guild: string
    commands: string[],
    contexts: string[],
}

export interface ConfigJson {
    private: PrivateiInteraction[]
}

export interface UtsukushiBotConfig extends BotConfig {
    ignoreDB: boolean;
    ignoreStore: boolean;
}

export interface Emoji {
    animated: boolean;
    id: string;
    name: string;
}

export interface SoundEffect {
    name: string;
    url: string;
    user: User
    guild?: Guild;
}

export interface Song {
    title?: string;
    url: string;
}

export interface HistoryItem<T> {
    item: T;
    date: Date;
}

export interface History<T> {
    enabled?: boolean;
    list: Array<HistoryItem<T>>;
}

export interface Guild {
    id: string;
    emojisShared: boolean;
    vocalNotifyChannel?: string | null;
    lastPlay?: Song;
}

export interface User {
    id: string;
    songs: History<Song>;
}

export interface UtsukushiSystem {
    emojis: Emoji[],
    soundEffects: SoundEffect[],
    activity: BotActivity,
    status: PresenceStatusData,
}
