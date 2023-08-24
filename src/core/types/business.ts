import { type ActivityType, type PresenceStatusData } from 'discord.js';

export type ProgProfile = 'prod' | 'dev' | 'test';

export interface BotActivity {
	status: string;
	code: ActivityType | number;
	url: string;
}

export interface BotConfig {
    default: {
        status: PresenceStatusData;
        activity: BotActivity;
    }
}
