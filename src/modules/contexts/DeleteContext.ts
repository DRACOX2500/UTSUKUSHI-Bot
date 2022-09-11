import { ApplicationCommandType, ContextMenuCommandBuilder, Message, MessageContextMenuCommandInteraction, MessageManager } from 'discord.js';
import { BotClient } from '../../class/BotClient';

export class DeleteContext {
	static readonly context: ContextMenuCommandBuilder = new ContextMenuCommandBuilder()
		.setName('Delete Up To This')
		.setType(ApplicationCommandType.Message);

	static readonly result = async (interaction: MessageContextMenuCommandInteraction, client: BotClient): Promise<void> => {
		const message: Message = interaction.targetMessage;
		const channelMessages: MessageManager | null = interaction.channel?.messages || null;
		if (!channelMessages) return;
		if (client.isRemoving) {
			interaction.reply('❌💣 I\'m already deleting somewhere, please try later');
			return;
		}

		client.isRemoving = true;
		interaction.deferReply();
		let deleteMessage = 0;

		await channelMessages?.fetch({ after: message.id }).then(
			async (messages) => {
				const interactionId = await interaction.fetchReply();
				messages.delete(interactionId.id);
				messages.forEach(mes => mes.delete());
				await message.delete();
				deleteMessage = messages.size + 1;
			}
		);

		client.isRemoving = false;
		interaction.editReply(`💣 I Deleted **${deleteMessage}** Message${ deleteMessage === 1 ? '' : 's' } !`)
			.then(
				() => { setTimeout(() => { interaction.deleteReply(); }, 3000); },
			);
	};
}