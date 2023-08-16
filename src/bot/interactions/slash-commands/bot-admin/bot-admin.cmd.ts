import { BotSlashCommand } from "@/core/bot-command";
import { ActivityType, ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js";
import { UtsukushiBotClient } from "@/bot/client";
import { BotSubCommandOptions } from "@/types/commands";
import { BotActivitySubCommand } from "./activity/activity.sub";
import { BotStatusSubCommand } from "./status/status.sub";

/**
 * @SlashCommand `bot-admin`
 *  - `bot activity [activity-type] [activity-message]` : Change Utsukushi profile activity !
 *  - `bot status [status-type]` : Change Utsukushi profile status !
 */
class BotCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super([
			new BotActivitySubCommand(),
			new BotStatusSubCommand()
		]);

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

export const command = new BotCommand();
