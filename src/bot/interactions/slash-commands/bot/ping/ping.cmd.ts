import { PongEmbedBuilder } from "@/bot/builders/embeds/pong";
import { BotClient } from "@/core/bot-client";
import { logger } from "@/core/logger";
import { BotSlashCommand } from "@/core/bot-command";
import { ChatInputCommandInteraction } from "discord.js";
import { ERROR_COMMAND } from "@/core/constants";

/**
 * @SlashCommand `ping`
 *  - `ping` : Reply with pong message
 */
class PingCommand extends BotSlashCommand {

	constructor() {
		super();
		this.command
			.setName('ping')
			.setDescription('Replies with Pong 🏓!')
			.setDMPermission(true);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client?: BotClient
	): Promise<void> {
		if (!client) throw new Error(ERROR_COMMAND);

		const sent =
			(await interaction.reply({ content: 'Pinging...', fetchReply: true })) ??
			null;

		const embedPong = new PongEmbedBuilder(sent, interaction, client);
		interaction.editReply({ content: '', embeds: [embedPong] }).catch((err: Error) => logger.error({}, err.message));
	};
}

export const command = new PingCommand();
