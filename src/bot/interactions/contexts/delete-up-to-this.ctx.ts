import { ApplicationCommandType, PermissionsBitField, type Message, type MessageContextMenuCommandInteraction, type CacheType } from 'discord.js';
import { type BotClient } from '../../../core/bot-client';
import { BotContextCommand } from '../../../core/bot-command';
import { ERROR_CMD_MESSAGE, ERROR_COMMAND } from '../../../core/constants';
import logger from '../../../core/logger';
import { type BotCommandOptions } from '../../../core/types/bot-command';


/**
 * @ContextCommand
 */
export class DeleteUpToThisContext extends BotContextCommand {

	constructor() {
		super();

		this.command
			.setName('Delete Up To This')
			.setType(ApplicationCommandType.Message)
			.setDMPermission(true)
			.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages);
	}

	private async delete(message: Message): Promise<number> {
		try {
			await message.delete();
		}
		catch (error) {
			logger.warn('Delete Up to this - target deleted');
			return 0;
		}
		return 1;
	}

	override async result(interaction: MessageContextMenuCommandInteraction<CacheType>, client: BotClient, options?: Partial<BotCommandOptions> | undefined): Promise<void> {
		const channel = interaction.channel;
		if (!channel) {
			await interaction.reply({ content: ERROR_CMD_MESSAGE, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		const message = interaction.targetMessage;
		const messagesManager = channel.messages;
		const user = interaction.user;

		const messages = await messagesManager.fetch({ after: message.id });
		const size = messages.size + 1;
		await interaction.reply({ content: `💣 Deleted ${size} message(s)...` });

		const deletedCount = [
			...await Promise.all(messages.map(async (_message) => await this.delete(_message))),
			await this.delete(message),
		].reduce((value, curr) => value + curr, 0);

		try {
			const reply = await interaction.fetchReply();
			if (reply) await reply.delete();
		}
		catch (error) {
			logger.warn('Delete Up to this - reply deleted');
		}
		await user.send({ content: `💣 ${deletedCount} message(s) have been deleted 💥 !` });
	}
}
export const context = new DeleteUpToThisContext();
