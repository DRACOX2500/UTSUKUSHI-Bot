import {
	ChatInputCommandInteraction,
	CacheType,
	PresenceStatusData,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { TWITCH_LINK } from 'src/constant';
import { Activity } from '@models/activity.model';

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
		client: UtsukushiClient,
		options: BotCommandOptions
	): Promise<void> {
		const newActivity: Activity = {
			status: options.activityMessage,
			type: options.activityType,
			url: TWITCH_LINK,
		};

		client.setActivity(newActivity);

		client.getDatabase().global.setData({ activity: newActivity });
		interaction.reply({
			content: '🤖 Bot activity has been change !',
			ephemeral: true,
		});
	}

	protected async setStatus(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiClient,
		options: BotCommandOptions
	): Promise<void> {
		client.setStatus(<PresenceStatusData>options.status);

		client.getDatabase().global.setData({ status: options.status });
		interaction.reply({
			content: '🤖 Bot status has been change !',
			ephemeral: true,
		});
	}
}
