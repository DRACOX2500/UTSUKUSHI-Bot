import {
	ChatInputCommandInteraction,
	CacheType,
	PresenceStatusData,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { TWITCH_LINK } from '@utils/const';
import { Activity } from 'root/src/models/activity.model';

/**
 * @Options
 * All SoundEffectSubCommand options
 */
export interface BotCommandOptions {
	activityType: number;
	activityMessage: string;
	status: string;
}

/**
 * @SubCommand
 */
export class BotSubCommand {
	protected async setActivity(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: BotClient,
		options: BotCommandOptions
	): Promise<void> {
		const newActivity: Activity = {
			status: options.activityMessage,
			type: options.activityType,
			url: TWITCH_LINK,
		};

		client.setActivity(newActivity);

		client.getDatabase().setCacheGlobal({ activity: newActivity });
		interaction.reply({
			content: '🤖 Bot activity has been change !',
			ephemeral: true,
		});
	}

	protected async setStatus(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: BotClient,
		options: BotCommandOptions
	): Promise<void> {
		client.setStatus(<PresenceStatusData>options.status);

		client.getDatabase().setCacheGlobal({ status: options.status });
		interaction.reply({
			content: '🤖 Bot status has been change !',
			ephemeral: true,
		});
	}
}
