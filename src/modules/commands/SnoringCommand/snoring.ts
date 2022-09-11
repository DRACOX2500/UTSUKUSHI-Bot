/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from 'discord.js';
import { BotClient } from '../../../class/BotClient';
import { YtbStream } from '../../../class/ytbStream';

const url = 'https://www.youtube.com/watch?v=V4ibUx_Vg28';

export class SnoringCommand {

	static readonly slash = new SlashCommandBuilder()
		.setName('snoring')
		.setDescription('Snores in Vocal Channel 💤!');

	static readonly result = async (interaction: any, client: BotClient) => {

		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('🚫 I\'m not tired !');

		await interaction.deferReply();

		const stream = new YtbStream();
		await stream.init(url);

		stream.setInfoEvent(() => {
			return interaction.editReply('💤💤💤');
		});

		client.connection.join(channel);
		client.connection.newBotPlayer()?.playMusic(stream.get(), true);
	};
}