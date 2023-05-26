import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	MessageContextMenuCommandInteraction,
	Message,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { UtsukushiMessageContextCommand } from '@models/utsukushi-command.model';
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

	readonly result = async (
		interaction: MessageContextMenuCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const channel = interaction.channel;
		if (!channel) return;

		this.targetMessage = await channel.messages.fetch(interaction.targetId);
		if (!this.targetMessage) return;
		await interaction.deferReply({ ephemeral: true });

		const emojis = client.data.global.getEmojis();
		if (!emojis?.length) {
			await interaction.editReply({ content: '❌ React Failed !' });
			return;
		}
		const targetId = interaction.targetId;
		const targetUrl = interaction.targetMessage.url;

		const reply = new ReactAsBotContextReply(targetId, targetUrl, emojis, 0);

		await interaction.editReply(reply);
	};
}
export const command = new ReactAsBotContext();
