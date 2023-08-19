import { ReactAsBotReply } from "@/bot/builders/replies/react-as-bot";
import { UtsukushiBotClient } from "@/bot/client";
import { BotContextCommand } from "@/core/bot-command";
import { ERROR_CMD_MESSAGE, ERROR_COMMAND } from "@/core/constants";
import { ApplicationCommandType, MessageContextMenuCommandInteraction, CacheType } from "discord.js";

/**
 * @ContextCommand
 */
export class ReplyAsBotContext extends BotContextCommand<UtsukushiBotClient> {

    constructor() {
        super();

        this.command
            .setName('React As Bot')
            .setType(ApplicationCommandType.Message);
    }

    override async result(
        interaction: MessageContextMenuCommandInteraction<CacheType>,
        client: UtsukushiBotClient,
    ): Promise<void> {
        const guild = interaction.guild;
        const channel = interaction.channel;
        const message = interaction.targetMessage;
		if (!guild || !channel) {
			await interaction.reply({ content: ERROR_CMD_MESSAGE, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

        await interaction.deferReply({ ephemeral: true });

        const emojis = await client.store.guilds.getEmojis(guild);

        const reply = new ReactAsBotReply(channel, message, emojis);

        await interaction.editReply(reply);
    }
}
export const context = new ReplyAsBotContext();