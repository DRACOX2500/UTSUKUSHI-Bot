import { PongEmbedBuilder } from "@/bot/builders/embeds/pong";
import { BotClient } from "@/core/bot-client";
import { logger } from "@/core/logger";
import { BotSlashCommand } from "@/core/types/bot-command";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

/**
 * @SlashCommand `ping`
 *  - `ping` : Reply with pong message
 */
class PingCommand implements BotSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong 🏓!')
		.setDMPermission(true);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client?: BotClient
	): Promise<void> => {
		if (!client) {
			interaction.reply('‼️🤖 No Client found !').catch((err: Error) => logger.error({}, err.message));
			return;
		}

		const sent =
			(await interaction.reply({ content: 'Pinging...', fetchReply: true })) ??
			null;

		const embedPong = new PongEmbedBuilder(sent, interaction, client);
		interaction.editReply({ content: '', embeds: [embedPong] }).catch((err: Error) => logger.error({}, err.message));
	};
}

export const command = new PingCommand();
