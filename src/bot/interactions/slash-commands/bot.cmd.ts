import { BotSlashCommand, BotPrivateCommand } from "@/core/types/bot-command";
import { SlashCommandBuilder, ActivityType, ChatInputCommandInteraction } from "discord.js";
import { BotActivitySubCommand, BotStatusSubCommand, BotSubCommandOptions } from "./sub-commands/bot.sub";
import { UtsukushiBotClient } from "@/bot/client";

/**
 * @SlashCommand `bot`
 * @PrivateCommand `GuildId`
 *  - `bot activity [activity-type] [activity-message]` : Change Utsukushi profile activity !
 *  - `bot status [status-type]` : Change Utsukushi profile status !
 */
export class BotCommand implements BotSlashCommand<UtsukushiBotClient>, BotPrivateCommand {

	private subCmdActivity = new BotActivitySubCommand();
	private subCmdStatus = new BotStatusSubCommand();

	readonly guildId = [];
	// TODO :
	// readonly guildId = config.privateCommands[0].bot.length
	// 	? config.privateCommands[0].bot
	// 	: null;

	readonly command = new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Manage bot 🤖!')
		.setDMPermission(true)
		.addSubcommand(this.subCmdActivity.subcommand)
		.addSubcommand(this.subCmdStatus.subcommand);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient
	): Promise<void> => {
		const subCommand = interaction.options.getSubcommand(true);
		const options: BotSubCommandOptions = {
			activityType:
				interaction.options.getInteger('activity-type') ?? ActivityType.Playing,
			activityMessage: interaction.options.getString('activity-message') ?? '',
			status: interaction.options.getString('status-type') ?? 'online',
		};

		// SubCommand  => Activity
		if (subCommand === 'activity') {
			await this.subCmdActivity.result(interaction, client, options);
		}
		// SubCommand  => Status
		else if (subCommand === 'status') {
			await this.subCmdStatus.result(interaction, client, options);
		}
	};
}

export const command = new BotCommand();
