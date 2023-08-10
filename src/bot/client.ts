import { BotClient } from "@/core/bot-client";
import { UtsukushiBotConfig } from "@/core/types/business";
import { connectMongoDB } from "@/database/database";
import { environment } from "@/environment";
import { GatewayIntentBits } from "discord.js";

export class UtsukushiBotClient extends BotClient {
    constructor(config?: Partial<UtsukushiBotConfig>) {
        super(
            environment.PROFILE,
            [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildVoiceStates,
            ],
            config
        );
        if (!config?.ignoreDB) connectMongoDB();
    }
}