/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	SlashCommandBuilder,
	InteractionResponse,
	ButtonInteraction,
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	CacheType,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { UtsukushiAutocompleteSlashCommand } from '@models/utsukushi-command.model';
import { YoutubeStream } from '@modules/system/audio/audio-stream';
import { PlayReply } from './play.reply';
import { logger } from 'root/src/modules/system/logger/logger';

const enum Platform {
	Youtube = 'youtube',
	// Spotify = 'spotify',
	// Soundcloud = 'soundcloud',
}

/**
 * @SlashCommand `play`
 * @AutocompleteInteraction
 *  - `play [song] [opti]?` : Play music
 */
export class PlayCommand implements UtsukushiAutocompleteSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play Music 🎵!')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('song')
				.setDescription('The Song you want to play')
				.setAutocomplete(true)
		)
		.addBooleanOption((option) =>
			option
				.setName('optimization')
				.setDescription(
					'Optimize the player\'s performance but disabled volume settings'
				)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		if (!interaction?.member || !interaction.guild) return;

		const VoiceChannel = (<any>interaction.member).voice.channel;
		if (!VoiceChannel) {
			interaction
				.reply('❌ You are not in a voice channel')
				.catch((err: Error) => logger.error({}, err.message));
			return;
		}

		await interaction.deferReply();

		let url = interaction.options.getString('song');
		const opti: boolean =
			!!interaction.options.get('optimization')?.value ?? false;

		if (!url) {
			url = await client
				.data
				.guilds.getByKey(interaction.guild.id)
				.then((response) => {
					return <string>response?.value.lastPlayURL;
				});
			if (!url) {
				interaction
					.editReply('❌ URL or Keywords are not available')
					.catch((err: Error) => logger.error({}, err.message));
				return;
			}
		}

		const stream = await new YoutubeStream.YoutubeAudioStream().getByKeywords(
			url
		);

		if (!stream.readable) {
			interaction.editReply('❌ Music not found !').catch((err: Error) => logger.error({}, err.message));
			return;
		}
		YoutubeStream.attachEvent(stream.readable, interaction);

		stream.readable.on('info', (info: any) => {
			if (!url || !stream) return;
			const reply = new PlayReply(info, Platform.Youtube, opti);
			interaction
				.editReply(reply)
				.catch((err: Error) => logger.error({}, err.message));

			client.data.guilds.set(<string>interaction.guildId, {
				lastPlayURL: stream.url,
			});
			client.data.users.getByKey(interaction.user.id).then((user) => {
				if (
					url &&
					!RegExp(/^https?:\/\//).exec(url) &&
					!user?.value.keywords?.includes(url)
				)
					client
						.data
						.users.set(interaction.user.id, { keywords: [url] });
			}).catch((err: Error) => logger.error({}, err.message));
		});

		client.connection.join(VoiceChannel);
		client.connection
			.newBotPlayer((<any>interaction).message)
			?.playMusic(stream.readable, opti);
	};

	readonly autocomplete = async (
		interaction: AutocompleteInteraction<CacheType>,
		client: UtsukushiClient
	): Promise<void> => {
		const focusedOption = interaction.options.getFocused(true);
		let choices: string[] | undefined;

		const data = await client.data.users.getByKey(interaction.user.id);
		if (!data?.value.keywords) return;

		if (focusedOption.name === 'song') {
			choices = data.value.keywords;
		}

		if (!choices) return;
		const filtered = choices.filter((choice) =>
			choice.toLowerCase().includes(focusedOption.value.toLowerCase())
		);
		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice }))
		);
	};

	static readonly reload = async (
		interaction: ButtonInteraction,
		client: UtsukushiClient
	): Promise<InteractionResponse | void> => {
		if (!interaction) return;

		const url = <string>interaction.message.embeds[0].url;
		const stream = await new YoutubeStream.YoutubeAudioStream().getByKeywords(
			url
		);
		if (!stream.readable) {
			interaction.editReply('❌ Music not found !').catch((err: Error) => logger.error({}, err.message));
			return;
		}

		const VoiceChannel = (<any>interaction).member.voice.channel;
		if (!VoiceChannel) return interaction.deferUpdate();

		client.connection.join(VoiceChannel);
		client.connection
			.newBotPlayer(interaction.message)
			?.playMusic(stream.readable);
	};
}

export const command = new PlayCommand();
