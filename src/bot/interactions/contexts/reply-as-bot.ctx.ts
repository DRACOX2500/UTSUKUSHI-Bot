import { ApplicationCommandType, type MessageContextMenuCommandInteraction, type CacheType } from 'discord.js';
import { type BotClient } from '../../../core/bot-client';
import { BotContextCommand } from '../../../core/bot-command';
import { ReplyAsBotModal } from '../modals/reply-as-bot.mdl';


/**
 * @ContextCommand
 */
export class ReplyAsBotContext extends BotContextCommand {

	constructor() {
		super();

		this.command
			.setName('Reply As Bot')
			.setType(ApplicationCommandType.Message)
			.setDMPermission(true);
	}

	override async result(
		interaction: MessageContextMenuCommandInteraction<CacheType>,
		client: BotClient,
	): Promise<void> {
        	const targetId = interaction.targetId;
        	const modal = new ReplyAsBotModal(targetId);
        	await interaction.showModal(modal);
	}
}
export const context = new ReplyAsBotContext();