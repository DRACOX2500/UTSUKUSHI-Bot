/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	SlashCommandBuilder,
	InteractionResponse,
	ButtonInteraction,
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	CacheType,
} from 'discord.js';
import { EmbedPlayer } from '@modules/system/embeds/play.embed';
import { BotClient } from 'src/BotClient';
import { YtbStream } from '@modules/system/audio/ytbStream';
import { UtsukushiAutocompleteSlashCommand } from '@models/utsukushi-command.model';

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
		client: BotClient
	): Promise<void> => {
		if (!interaction || !interaction.member || !interaction.guild) return;

		const VoiceChannel = (<any>interaction.member).voice.channel;
		if (!VoiceChannel) {
			interaction.reply('❌ You are not in a voice channel');
			return;
		}

		await interaction.deferReply();

		let url: string = <string>(
			interaction.options.get('song')?.value?.toString()
		);
		const opti: boolean =
			!!interaction.options.get('optimization')?.value ?? false;

		if (!url) {
			url = await client
				.getDatabase()
				.guilds.getByKey(interaction.guild.id)
				.then((response) => {
					return <string>response?.value.lastPlayURL;
				});
			if (!url) {
				interaction.editReply('❌ URL or Keywords are not available');
				return;
			}
		}

		const stream = new YtbStream();
		await stream.init(url, interaction);

		if (!stream.isFound) {
			interaction.editReply('❌ Music not found !');
			return;
		}

		stream.setInfoEvent(async (info: any) => {
			const embedPlayer = new EmbedPlayer(info, opti);

			const embed = embedPlayer.getEmbed();
			const comp = embedPlayer.getButtonMenu();
			(<any>interaction).editReply({ embeds: [embed], components: [comp] });

			client.getDatabase().guilds.set(<string>interaction.guildId, {
				lastPlayURL: stream.video.url,
			});
			const keywordsCache = await client
				.getDatabase()
				.users.getByKey(interaction.user.id);
			if (!url.match(/^https?:\/\//) && !keywordsCache?.value.keywords?.includes(url))
				client.getDatabase().users.set(interaction.user.id, { keywords: [url] });
		});

		client.connection.join(VoiceChannel);
		client.connection
			.newBotPlayer((<any>interaction).message)
			?.playMusic(stream.get(), opti);
	};

	readonly autocomplete = async (
		interaction: AutocompleteInteraction<CacheType>,
		client: BotClient
	): Promise<void> => {
		const focusedOption = interaction.options.getFocused(true);
		let choices: string[] | undefined;

		const data = await client.getDatabase().users.getByKey(interaction.user.id);
		if (!data || !data.value.keywords) return;

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
		client: BotClient
	): Promise<InteractionResponse | void> => {
		if (!interaction) return;

		const url = <string>interaction.message.embeds[0].url;
		const stream = new YtbStream();
		await stream.init(url);

		const VoiceChannel = (<any>interaction).member.voice.channel;
		if (!VoiceChannel) return interaction.deferUpdate();

		client.connection.join(VoiceChannel);
		client.connection
			.newBotPlayer(interaction.message)
			?.playMusic(stream.get());
	};
}

export const command = new PlayCommand();
