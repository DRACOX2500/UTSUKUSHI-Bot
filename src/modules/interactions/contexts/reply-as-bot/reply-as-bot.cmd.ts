import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	MessageContextMenuCommandInteraction,
} from 'discord.js';
import { UtsukushiMessageContextCommand } from '@models/UtsukushiCommand';
import { ReplyAsBotModal } from '../../modals/reply-as-bot.modal';

/**
 * @ContextCommand
 */
export class ReplyAsBotContext implements UtsukushiMessageContextCommand {

	readonly command = new ContextMenuCommandBuilder()
		.setName('Reply As Bot')
		.setType(ApplicationCommandType.Message)
		.setDMPermission(true);

	readonly result = async (
		interaction: MessageContextMenuCommandInteraction
	): Promise<void> => {
		const targetId = interaction.targetId;
		const modal = new ReplyAsBotModal(targetId);
		await interaction.showModal(modal);
	};
}
export const command = new ReplyAsBotContext();
