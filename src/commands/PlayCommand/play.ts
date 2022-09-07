/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, InteractionResponse, Message } from 'discord.js';
import { EmbedPlayer } from '../../class/embedPlayer';
import { BotClient } from '../../class/BotClient';
import { YtbStream } from '../../class/ytbStream';

export class PlayCommand {

	static readonly slash = new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play Music 🎵!')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('The Song you want to play')
				.setRequired(true));

	static readonly result = async (interaction: any, client: BotClient): Promise<Message<boolean> | InteractionResponse<boolean> | void> => {
		if (!interaction || !interaction.member) return;

		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('❌ You are not in a voice channel');

		await interaction.deferReply();

		const url = interaction.options.get('song')?.value?.toString();
		if (!url) return interaction.reply('❌ URL or Keywords are not available');

		const stream = new YtbStream();
		await stream.init(url);

		if (!stream.source.found)
			return interaction.editReply('❌ Music not found !');

		stream.setInfoEvent(async (info: any) => {
			const embedPlayer = new EmbedPlayer(info);

			const embed = embedPlayer.getEmbed();
			const comp = embedPlayer.getButtonMenu();
			return interaction.editReply({ embeds: [embed], components: [comp] });
		});

		client.connection.join(channel);
		client.connection.newBotPlayer()?.playMusic(stream.get());
	};
}