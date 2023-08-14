import { BotClient } from "@/core/bot-client";
import { OnAfterReady } from "@/core/bot-client-events";
import { BotActivity } from "@/core/types/business";
import { connectMongoDB } from "@/database/database";
import { ProfileService } from "@/services/profile-service";
import { UtsukushiStore } from "@/services/stores/utsukushi.store";
import { UtsukushiBotConfig } from "@/types/business";
import { GatewayIntentBits } from "discord.js";

export class UtsukushiBotClient extends BotClient implements OnAfterReady {

    readonly store: UtsukushiStore;

    constructor(config?: Partial<UtsukushiBotConfig>) {
        super(
            ProfileService.profile,
            [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildVoiceStates,
            ],
            config
        );
        if (!config?.ignoreDB) connectMongoDB();
        this.store = new UtsukushiStore();
        this.store.initialize();
    }

    override onAfterReady(): void {
        const syst = this.store.value
        super.setActivity(syst.activity);
        super.setStatus(syst.status);
    }
}