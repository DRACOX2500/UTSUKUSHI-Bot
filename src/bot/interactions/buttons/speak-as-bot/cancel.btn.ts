import { ButtonInteraction, CacheType } from "discord.js";
import { BotButton } from "../../../../core/bot-command";
import { CancelButton } from "../../../builders/buttons/cancel";
import { UtsukushiBotClient } from "../../../client";


class Button extends BotButton<UtsukushiBotClient> {
    button = new CancelButton('sab-cancel');
    override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const userId = interaction.user.id;
        delete client.store.clipboard[userId];
        await interaction.deferUpdate();
    }
}

export const button = new Button();