import { ContextMenuCommandBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction, Message, ReplyMessageOptions } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiMessageContextCommand } from '@models/UtsukushiCommand';
import { ReactAsBotContextReply } from './react-as-bot.reply';

/**
 * @ContextCommand
 */
export class ReactAsBotContext implements UtsukushiMessageContextCommand {

	private targetMessage!: Message | null;

	readonly command = new ContextMenuCommandBuilder()
		.setName('React As Bot')
		.setType(ApplicationCommandType.Message)
		.setDMPermission(true);

	readonly result = async (interaction: MessageContextMenuCommandInteraction, client: BotClient): Promise<void> => {

		const channel = interaction.channel;
		if (!channel) return;

		this.targetMessage = await channel.messages.fetch(interaction.targetId);
		if (!this.targetMessage) return;
		await interaction.deferReply({ ephemeral: true });

		const emojis = await client.getDatabase().dataCache.fetchEmojis();
		if (!emojis || !emojis.length) {
			await interaction.editReply({ content: '❌ React Failed !' });
			return;
		}
		const targetId = interaction.targetId;

		const reply = new ReactAsBotContextReply(targetId, emojis, 0);

		await interaction.editReply(reply);
	};
}
export const command = new ReactAsBotContext();