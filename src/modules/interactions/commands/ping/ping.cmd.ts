import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { PongEmbed } from '@modules/system/embeds/pong.embed';
import { UtsukushiSlashCommand } from '@models/utsukushi-command.model';

/**
 * @SlashCommand `ping`
 *  - `ping` : Reply with pong message
 */
export class PingCommand implements UtsukushiSlashCommand {
	readonly command: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong 🏓!')
		.setDMPermission(true);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client?: UtsukushiClient
	): Promise<void> => {
		if (!client) {
			interaction.reply('‼️🤖 No Client found !');
			return;
		}

		const sent =
			(await interaction.reply({ content: 'Pinging...', fetchReply: true })) ??
			null;

		const embedPong = new PongEmbed(sent, interaction, client);
		interaction.editReply({ content: '', embeds: [embedPong.getEmbed()] });
	};
}

export const command = new PingCommand();
