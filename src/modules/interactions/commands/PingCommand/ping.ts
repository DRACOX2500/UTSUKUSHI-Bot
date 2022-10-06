import { SlashCommandBuilder, ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { EmbedPong } from '@modules/system/embeds/embedPong';

export class PingCommand {

	static readonly slash: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong 🏓!');

	static readonly result = async (interaction: ChatInputCommandInteraction | null, client: BotClient | null): Promise<InteractionResponse | number | void> => {
		if (!client) return interaction?.reply('‼️🤖 No Client found !') ?? 1;

		const sent = await interaction?.reply({ content: 'Pinging...', fetchReply: true }) ?? null;

		const embedPong = new EmbedPong(sent, interaction, client);
		interaction?.editReply({ content: '', embeds: [embedPong.getEmbed()] });
	};

}