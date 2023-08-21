import { ButtonInteraction, CacheType } from "discord.js";
import { BotButton } from "../../../../core/bot-command";
import { DiscordService } from "../../../../services/discord-service";
import { PreviousButton } from "../../../builders/buttons/previous";
import { ReactAsBotReply } from "../../../builders/replies/react-as-bot";
import { UtsukushiBotClient } from "../../../client";


class Button extends BotButton<UtsukushiBotClient> {
    button = new PreviousButton('rcab-prev');
    override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const guild = interaction.guild;
        const channel = interaction.channel;

        if (guild && channel) {
            const message = interaction.message;
            const emojis = await client.store.guilds.getEmojis(guild);

            const start = DiscordService.getStart(message.content, emojis.length) - 25;

            const reply = new ReactAsBotReply(channel, message, emojis, start);
            await interaction.reply({ ...reply, ephemeral: true });
        }
        await interaction.deferUpdate();
    }
}

export const button = new Button();