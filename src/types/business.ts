import { BotActivity, BotConfig } from "@/core/types/business";
import { PresenceStatusData } from "discord.js";

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
}

export interface Song {
    title?: string;
    url: string;
}

export interface Guild {
    id: string;
    name: string;
    emojisShared: boolean;
    vocalNotifyChannel?: string;
    lastPlay: Song;
    soundEffects: SoundEffect[];
}

export interface User {
    id: string;
    username: string;
    songs: Song[];
}

export interface UtsukushiSystem {
    emojis: Emoji[],
    soundEffects: SoundEffect[],
    activity: BotActivity,
    status: PresenceStatusData,
}
