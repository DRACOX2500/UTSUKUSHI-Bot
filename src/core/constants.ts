import { environment } from "@/environment";
import { PresenceStatusData } from "discord.js";

export const TWITCH_LINK = 'https://www.twitch.tv/*';

export const ERROR_USERNAME = '#error#';
export const ERROR_COMMAND = '❌ Command Failed !';

export const DEFAULT_ACTIVITY = {
    status: 'idle' as PresenceStatusData,
    activity: {
        status: `version ${environment.APP_VERSION}`,
        code: 1,
        url: TWITCH_LINK,
    },
}