import { ConfirmButton } from "@/bot/builders/buttons/confirm";
import { UtsukushiBotClient } from "@/bot/client";
import { BotButton } from "@/core/bot-command";
import { ButtonInteraction, CacheType } from "discord.js";

class Button extends BotButton<UtsukushiBotClient> {
    button = new ConfirmButton('sab-confirm');
    override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const userId = interaction.user.id;
        const message = client.store.clipboard[userId];

        if (message) {
            await interaction.channel?.send({ content: message.message, files: message.attachments });
            delete client.store.clipboard[userId];
        }
        await interaction.deferUpdate();
    }
}

export const button = new Button();