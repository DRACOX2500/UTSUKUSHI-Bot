/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatInputCommandInteraction, CacheType, bold } from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { YOUTUBE_VIDEO_LINK_REGEX } from 'src/constant';
import { Converter } from '@utils/converter';
import { YoutubeStream } from '@modules/system/audio/audio-stream';

/**
 * @Options
 * All SoundEffectSubCommand options
 */
export interface SoundEffectCommandOptions {
	effect: string;
	name: string;
	url: string;
}

/**
 * @SubCommand
 */
export class SoundEffectSubCommand {
	protected async play(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiClient,
		options: SoundEffectCommandOptions
	) {
		const channel = (<any>interaction.member).voice.channel;
		if (!channel) {
			interaction.reply({
				content: '❌ You are not in a voice channel',
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		const stream = await new YoutubeStream.YoutubeAudioStream().getByUrl(options.effect);
		if (!stream.readable) {
			interaction.editReply('❌ Music not found !');
			return;
		}
		YoutubeStream.attachEvent(stream.readable, interaction);

		stream.readable.on('info', async () => {
			return interaction.editReply({
				content: 'Play Sound Effect Succefully 🎶!',
			});
		});

		client.connection.join(channel);
		client.connection
			.newBotPlayer((<any>interaction).message)
			?.playMusic(stream.readable, true);
	}

	protected async add(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiClient,
		options: SoundEffectCommandOptions
	) {
		if (!options.url.match(YOUTUBE_VIDEO_LINK_REGEX)) {
			await interaction.reply({
				content: '❌ Sound Effect URL isn\'t a YouTube video !',
				ephemeral: true,
			});
			return;
		}

		const data = client.getDatabase().global.getSoundEffects();
		if (data && data.some((effect) => effect.key === options.name)) {
			await interaction.reply({
				content: `❌ Sound Effect key ${bold(options.name)} already exist !`,
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		const res = await YoutubeStream.YoutubeAudioStream.getDataByURL(options.url);
		const duration = Converter.durationStringToNumber(res.duration);
		if (duration && duration > 30000) {
			await interaction.editReply({
				content: '❌ Sound Effect is too long (max 30 seconds) !',
			});
			return;
		}

		client.getDatabase().global.setSoundEffects([{
			key: options.name,
			url: options.url,
		}]);

		await interaction.editReply({
			content: `Sound Effect ${bold(options.name)} has been Added ✅!`,
		});
	}
}

