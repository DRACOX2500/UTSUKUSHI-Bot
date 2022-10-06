import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { EmbedPong } from '@modules/system/embeds/embedPong';
import { UtsukushiSlashCommand } from '@models/UtsukushiSlashCommand';

export class PingCommand implements UtsukushiSlashCommand {

	readonly slash: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong 🏓!');

	readonly result = async (interaction: ChatInputCommandInteraction, client?: BotClient): Promise<void> => {
		if (!client) {
			interaction.reply('‼️🤖 No Client found !');
			return;
		}

		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true }) ?? null;

		const embedPong = new EmbedPong(sent, interaction, client);
		interaction.editReply({ content: '', embeds: [embedPong.getEmbed()] });
	};

}

export const command = new PingCommand();