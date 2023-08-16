import { BotClient } from "@/core/bot-client";
import { BotSubSlashCommand } from "@/core/bot-command";
import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { GITHUB_LINK } from "@/constants";

/**
 * @SubSlashCommand `git`
 *  - `git` : Get GitHub link
 */
export class GitSubCommand extends BotSubSlashCommand {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('git')
			.setDescription('Get GitHub Repository 🛠️!');
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		_client?: BotClient
	): Promise<void> {
		interaction.reply({
			content: GITHUB_LINK,
			ephemeral: true,
		});;
	};
}
