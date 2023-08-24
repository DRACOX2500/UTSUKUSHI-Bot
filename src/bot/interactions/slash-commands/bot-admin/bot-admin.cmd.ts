import { type ChatInputCommandInteraction, type CacheType, ActivityType } from 'discord.js';
import { BotSlashCommand } from '../../../../core/bot-command';
import { type BotSubCommandOptions } from '../../../../types/commands';
import { type UtsukushiBotClient } from '../../../client';
import { ActivitySubCommand } from './activity/activity.sub';
import { StatusSubCommand } from './status/status.sub';


/**
 * @SlashCommand `bot-admin`
 *  - `bot activity [activity-type] [activity-message]` : Change Utsukushi profile activity !
 *  - `bot status [status-type]` : Change Utsukushi profile status !
 */
class BotAdminCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
			'activity': new ActivitySubCommand(),
			'status': new StatusSubCommand(),
		});

		this.command
			.setName('bot-admin')
			.setDescription('Manage bot 🤖!')
			.setDMPermission(true);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const options: BotSubCommandOptions = {
			activityType:
				interaction.options.getInteger('activity-type') ?? ActivityType.Playing,
			activityMessage: interaction.options.getString('activity-message') ?? '',
			status: interaction.options.getString('status-type') ?? 'online',
		};
		super.result(interaction, client, options);
	}
}

export const command = new BotAdminCommand();
