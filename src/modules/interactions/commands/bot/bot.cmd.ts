import {
	SlashCommandBuilder,
	SlashCommandIntegerOption,
	ActivityType,
	ChatInputCommandInteraction,
	SlashCommandStringOption,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import {
	UtsukushiPrivateCommand,
	UtsukushiSlashCommand,
} from '@models/utsukushi-command.model';
import { BotCommandOptions, BotSubCommand } from './bot.sub';
import config from 'root/utsukushi.config.json';

/**
 * @SlashCommand `bot`
 * @PrivateCommand `GuildId`
 *  - `bot activity [activity-type] [activity-message]` : Change Utsukushi profile activity !
 *  - `bot status [status-type]` : Change Utsukushi profile status !
 */
export class BotCommand
	extends BotSubCommand
	implements UtsukushiSlashCommand, UtsukushiPrivateCommand {
	readonly guildId = config.privateCommands[0].bot.length
		? config.privateCommands[0].bot
		: null;

	readonly command = new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Manage bot 🤖!')
		.setDMPermission(true)
		.addSubcommand((subcommand) =>
			subcommand
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
				.addStringOption((option) =>
					option
						.setName('activity-message')
						.setDescription('Message of bot activity')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
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
				)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const subCommand = interaction.options.getSubcommand(true);
		const options: BotCommandOptions = {
			activityType:
				interaction.options.getInteger('activity-type') ?? ActivityType.Playing,
			activityMessage: interaction.options.getString('activity-message') ?? '',
			status: interaction.options.getString('status-type') ?? 'online',
		};

		// SubCommand  => Activity
		if (subCommand === 'activity') {
			await this.setActivity(interaction, client, options);
		}
		// SubCommand  => Status
		else if (subCommand === 'status') {
			await this.setStatus(interaction, client, options);
		}
	};
}

export const command = new BotCommand();
