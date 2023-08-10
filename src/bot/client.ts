import { BotClient } from "@/core/bot-client";
import { GatewayIntentBits } from "discord.js";

export class UtsukushiBotClient extends BotClient {
    constructor() {
        super('dev', [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildVoiceStates,
        ]);
    }
}