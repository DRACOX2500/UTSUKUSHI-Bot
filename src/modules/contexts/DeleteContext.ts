import { ApplicationCommandType, ContextMenuCommandBuilder, GuildMember, Message, MessageContextMenuCommandInteraction, MessageManager, PermissionsBitField, TextBasedChannel } from 'discord.js';
import { BotClient } from '@class/BotClient';

export class DeleteContext {
	static readonly context: ContextMenuCommandBuilder = new ContextMenuCommandBuilder()
		.setName('Delete Up To This')
		.setType(ApplicationCommandType.Message);

	static readonly result = async (interaction: MessageContextMenuCommandInteraction, client: BotClient): Promise<void> => {

		const m = <GuildMember>interaction.member;
		if (!m.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			interaction.reply('🔒 You do not have permission to manage messages')
				.then(() => { setTimeout(() => interaction.deleteReply().catch(error => console.log(error.message)), 3000); },);
			return;
		}


		const message: Message = interaction.targetMessage;
		const channelMessages: MessageManager | null = interaction.channel?.messages || null;
		if (!channelMessages) return;
		if (client.isRemoving) {
			interaction.reply('❌💣 I\'m already deleting somewhere, please try later')
				.then(() => { setTimeout(() => interaction.deleteReply().catch(error => console.log(error.message)), 3000); },);
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
		interaction.editReply(
			`💣 I Deleted **${deleteMessage}** Message${ deleteMessage === 1 ? '' : 's' } !\n\n` +
			'(*===This message will self-destruct in **3** seconds===*)'
		)
			.then(() => { setTimeout(() => { interaction.deleteReply().catch(error => console.log(error.message)); }, 3000); },)
			.catch(() => {
				const c = <TextBasedChannel>interaction.channel;
				c.send(`💣 I Deleted **${deleteMessage}** Message${ deleteMessage === 1 ? '' : 's' } !`);
			});
	};
}