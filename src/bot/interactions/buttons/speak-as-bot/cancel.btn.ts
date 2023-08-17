import { ConfirmButton as CancelButton } from "@/bot/builders/buttons/confirm";
import { UtsukushiBotClient } from "@/bot/client";
import { BotButton } from "@/core/bot-command";
import { ButtonInteraction, CacheType } from "discord.js";

class Button extends BotButton<UtsukushiBotClient> {
    button = new CancelButton('sab-cancel');
    override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const userId = interaction.user.id;
        delete client.store.clipboard[userId];
        await interaction.deferUpdate();
    }
}

export const button = new Button();