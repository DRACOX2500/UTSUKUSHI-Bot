import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { BotClient } from "../../../../../core/bot-client";
import { BotSubSlashCommand } from "../../../../../core/bot-command";
import { ERROR_COMMAND } from "../../../../../core/constants";
import { PongEmbedBuilder } from "../../../../builders/embeds/pong";


/**
 * @SubSlashCommand `ping`
 *  - `ping` : Reply with pong message
 */
export class PingSubCommand extends BotSubSlashCommand {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('ping')
			.setDescription('Replies with Pong 🏓!');
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client?: BotClient
	): Promise<void> {
		if (!client) throw new Error(ERROR_COMMAND);

		const sent =
			(await interaction.reply({ content: 'Pinging...', fetchReply: true })) ??
			null;

		const embed = new PongEmbedBuilder(sent, interaction, client);
		await interaction.editReply({ embeds: [embed] });
	};
}
