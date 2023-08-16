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
    emojisShared: boolean;
    vocalNotifyChannel?: string | null;
    lastPlay?: Song;
    soundEffects: SoundEffect[];
}

export interface User {
    id: string;
    songs: Song[];
}

export interface UtsukushiSystem {
    emojis: Emoji[],
    soundEffects: SoundEffect[],
    activity: BotActivity,
    status: PresenceStatusData,
}
