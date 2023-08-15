import { UtsukushiBotClient } from "@/bot/client";
import { ERROR_COMMAND, TWITCH_LINK } from "@/core/constants";
import { logger } from "@/core/logger";
import { BotSubSlashCommand } from "@/core/types/bot-command";
import { BotActivity } from "@/core/types/business";
import { ChatInputCommandInteraction, CacheType, PresenceStatusData, SlashCommandSubcommandBuilder, ActivityType, SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";

/**
 * @Options
 * All SoundEffectSubCommand options
 */
export interface BotSubCommandOptions {
	activityType: number;
	activityMessage: string;
	status: string;
}

/**
 * @SubCommand
 */
export class BotActivitySubCommand implements BotSubSlashCommand<UtsukushiBotClient, BotSubCommandOptions> {
	subcommand = (subcommandGroup: SlashCommandSubcommandBuilder) => subcommandGroup
		.setName('activity')
		.setDescription('Change Bot activity 🤖!')
		.addIntegerOption((option: SlashCommandIntegerOption) =>
			option
				.setName('activity-type')
				.setDescription('Type of bot activity')
				.addChoices(
					{ name: 'Play', value: ActivityType.Playing },
					{ name: 'Listen', value: ActivityType.Listening },
					{ name: 'Stream', value: ActivityType.Streaming },
					{ name: 'Competing', value: ActivityType.Competing },
					{ name: 'Watch', value: ActivityType.Watching }
				)
				.setRequired(true)
		)
		.addStringOption((option: SlashCommandStringOption) =>
			option
				.setName('activity-message')
				.setDescription('Message of bot activity')
				.setRequired(true)
		);

	result = async (
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiBotClient,
		options?: BotSubCommandOptions) =>
	{
			if (!options) throw new Error(ERROR_COMMAND);

			const newActivity: BotActivity = {
				status: options.activityMessage,
				code: options.activityType,
				url: TWITCH_LINK,
			};

			client.setActivity(newActivity);

			client.store.updateActivity(newActivity);
			interaction.reply({
				content: '🤖 Bot activity has been change !',
				ephemeral: true,
			}).catch((err: Error) => logger.error({}, err.message));
	};
}

/**
 * @SubCommand
 */
export class BotStatusSubCommand implements BotSubSlashCommand<UtsukushiBotClient, BotSubCommandOptions> {
	subcommand = (subcommandGroup: SlashCommandSubcommandBuilder) => subcommandGroup
		.setName('status')
		.setDescription('Change Bot status 🤖!')
		.addStringOption((option: SlashCommandStringOption) =>
			option
				.setName('status-type')
				.setDescription('Type of bot activity')
				.addChoices(
					{ name: 'Online', value: 'online' },
					{ name: 'Idle', value: 'idle' },
					{ name: 'Do Not Disturb', value: 'dnd' },
					{ name: 'Invisible', value: 'invisible' }
				)
				.setRequired(true)
		);

	result = async (
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiBotClient,
		options?: BotSubCommandOptions) =>
	{
		if (!options) throw new Error(ERROR_COMMAND);

		client.setStatus(options.status as PresenceStatusData);

		client.store.updateStatus(options.status as PresenceStatusData);
		interaction.reply({
			content: '🤖 Bot status has been change !',
			ephemeral: true,
		}).catch((err: Error) => logger.error({}, err.message));
	};
}
