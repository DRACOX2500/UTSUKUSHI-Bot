/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { YtbStream } from '@modules/system/audio/ytbStream';
import { UtsukushiCommand } from '@models/UtsukushiCommand';

const url = '';

export class SnoringCommand implements UtsukushiCommand<ChatInputCommandInteraction> {

	readonly command = new SlashCommandBuilder()
		.setName('snoring')
		.setDescription('Snores in Vocal Channel 💤!');

	readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> => {

		const channel = (<any>interaction.member).voice.channel;
		if (!channel) {
			interaction.reply({ content: '🚫 I\'m not tired !', ephemeral: true });
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		const stream = new YtbStream();
		await stream.init(url);

		stream.setInfoEvent(() => {
			return interaction.editReply({ content: '💤💤💤' });
		});

		client.connection.join(channel);
		client.connection.newBotPlayer((<any>interaction).message)?.playMusic(stream.get(), true);
	};
}

export const command = new SnoringCommand();