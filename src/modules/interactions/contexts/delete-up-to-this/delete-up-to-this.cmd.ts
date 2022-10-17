import {
	ApplicationCommandType,
	ContextMenuCommandBuilder,
	Message,
	MessageContextMenuCommandInteraction,
	MessageManager,
	PermissionsBitField,
	TextBasedChannel,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { UtsukushiMessageContextCommand } from '@models/utsukushi-command.model';

/**
 * @ContextCommand
 */
export class DeleteUpToThisContext implements UtsukushiMessageContextCommand {
	readonly command: ContextMenuCommandBuilder = new ContextMenuCommandBuilder()
		.setName('Delete Up To This')
		.setType(ApplicationCommandType.Message)
		.setDMPermission(true)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages);

	readonly result = async (
		interaction: MessageContextMenuCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const message: Message = interaction.targetMessage;
		const messagesManager: MessageManager | null =
			interaction.channel?.messages || null;
		if (!messagesManager) return;
		if (client.removerManager.isFull) {
			interaction
				.reply('❌💣 I\'m already deleting somewhere, please try later')
				.then(() => {
					setTimeout(
						() =>
							interaction
								.deleteReply()
								.catch((error) => console.error(error.message)),
						3000
					);
				});
			return;
		}
		await interaction.deferReply();

		const remover = client.removerManager.addRemover(interaction.channelId);
		if (!remover) {
			interaction
				.editReply(
					'❌💣 I\'m already deleting in this channel, please try later'
				)
				.then(() => {
					setTimeout(
						() =>
							interaction
								.deleteReply()
								.catch((error) => console.error(error.message)),
						3000
					);
				});
			return;
		}
		const deleteMessage = await remover.run(
			interaction,
			messagesManager,
			message
		);
		client.removerManager.deleteRemover(interaction.channelId);

		interaction
			.editReply(
				`💣 I Deleted **${deleteMessage}** Message${
					deleteMessage === 1 ? '' : 's'
				} !\n\n` + '(*===This message will self-destruct in **3** seconds===*)'
			)
			.then(() => {
				setTimeout(() => {
					interaction
						.deleteReply()
						.catch((error) => console.error(error.message));
				}, 3000);
			})
			.catch(() => {
				const c = <TextBasedChannel>interaction.channel;
				c.send(
					`💣 I Deleted **${deleteMessage}** Message${
						deleteMessage === 1 ? '' : 's'
					} !`
				);
			});
	};
}
export const command = new DeleteUpToThisContext();
