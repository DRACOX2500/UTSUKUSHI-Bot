import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from '../../../class/BotClient';
import { EmbedPong } from '../../../class/embed/embedPong';

export class PingCommand {

	static readonly slash: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong 🏓!');

	static readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient | null) => {
		if (!client) return interaction.reply('‼️🤖 No Client found !');

		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		const embedPong = new EmbedPong(sent, interaction, client);
		interaction.editReply({ content: '', embeds: [embedPong.getEmbed()] });

	};

}