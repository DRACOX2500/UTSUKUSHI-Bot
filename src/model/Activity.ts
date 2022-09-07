import { ActivityType } from 'discord.js';

export interface Activity {
    status: string;
    type: ActivityType.Playing |
            ActivityType.Streaming |
            ActivityType.Listening |
            ActivityType.Watching |
            ActivityType.Competing |
            number;
    url: string;
}