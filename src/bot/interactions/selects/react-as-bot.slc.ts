import { StringSelectMenuInteraction } from "discord.js";
import { BotSelect } from "../../../core/bot-command";
import { DiscordService } from "../../../services/discord-service";
import { ReactAsBotSelect } from "../../builders/selects/react-as-bot";
import { UtsukushiBotClient } from "../../client";


class Select extends BotSelect<UtsukushiBotClient> {
    select = new ReactAsBotSelect('rcab-select');
    override async result(interaction: StringSelectMenuInteraction, client: UtsukushiBotClient): Promise<void> {
        const channel = interaction.channel;
        const message = interaction.message;

        if (!channel || !message) {
            await interaction.deferUpdate();
            return;
        }

        const link = DiscordService.findFirstLink(message.content);
        if (link) {
            const targetId = DiscordService.getMessageIdFromLink(link);

		    const target = await channel.messages.fetch(targetId);

		    if (target) await Promise.all(interaction.values.map(async (value) => await target.react(value)));
        }
		await interaction.deferUpdate();
    }
}

export const select = new Select();