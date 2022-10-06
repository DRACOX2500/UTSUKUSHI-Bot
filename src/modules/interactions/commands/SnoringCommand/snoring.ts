/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { YtbStream } from '@modules/system/audio/ytbStream';
import { UtsukushiSlashCommand } from '@models/UtsukushiSlashCommand';

const url = 'https://www.youtube.com/watch?v=V4ibUx_Vg28';

export class SnoringCommand implements UtsukushiSlashCommand {

	readonly slash = new SlashCommandBuilder()
		.setName('snoring')
		.setDescription('Snores in Vocal Channel 💤!');

	readonly result = async (interaction: any, client: BotClient): Promise<void> => {

		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('🚫 I\'m not tired !');

		await interaction.deferReply();

		const stream = new YtbStream();
		await stream.init(url);

		stream.setInfoEvent(() => {
			return interaction.editReply('💤💤💤');
		});

		client.connection.join(channel);
		client.connection.newBotPlayer(interaction.message)?.playMusic(stream.get(), true);
	};
}

export const command = new SnoringCommand();