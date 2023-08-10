import { ActivityType, PresenceStatusData } from "discord.js";

export type ProgProfil = 'prod' | 'dev' | 'test';

export interface BotActivity {
	status: string;
	type: ActivityType | number;
	url: string;
}

export interface BotConfig {
    default: {
        status: PresenceStatusData;
        activity: BotActivity;
    }
}