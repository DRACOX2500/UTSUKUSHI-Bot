/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteInteraction, bold, CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiAutocompleteSlashCommand } from 'src/models/UtsukushiCommand';
import { YtbStream } from 'src/modules/system/audio/ytbStream';

/**
 * @SlashCommand
 * @AutocompleteInteraction
 *  - `soundeffect play [effect]` : Play sound effect
 *  - `soundeffect add [key] [url]` : Add sound effect to the database
 */
export class SoundEffectCommand
implements UtsukushiAutocompleteSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('soundeffect')
		.setDescription('Sound Effect in Vocal Channel 🎶!')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('Play Sound Effect in Vocal Channel 🔊🎶!')
				.addStringOption((option) =>
					option
						.setName('effect')
						.setDescription('The sound effect you want to play')
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add Sound Effect in Database ➕🎶!')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('The name of your sound effect')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('url')
						.setDescription('The youtube URL of your sound effect')
						.setRequired(true)
				)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {
		const subCommand = interaction.options.getSubcommand();
		const options = {
			effect: interaction.options.getString('effect') ?? '',
			name: interaction.options.getString('name') ?? '',
			url: interaction.options.getString('url') ?? '',
		};

		if (subCommand === 'add') {
			const data = await client.getDatabase().getCacheGlobal();
			if (data && data.soundEffects?.some(effect => effect.key === options.name)) {
				await interaction.reply({ content: `❌ Sound Effect key ${bold(options.name)} already exist !`, ephemeral: true });
				return;
			}

			client.getDatabase().setCacheGlobal({
				soundEffects: [{
					key: options.name,
					url: options.url,
				}],
			});
			await interaction.reply({ content: `Sound Effect ${bold(options.name)} has been Added ✅!`, ephemeral: true });
		}
		else if (subCommand === 'play') {
			const channel = (<any>interaction.member).voice.channel;
			if (!channel) {
				interaction.reply({ content: '❌ You are not in a voice channel', ephemeral: true });
				return;
			}

			await interaction.deferReply({ ephemeral: true });

			const stream = new YtbStream();
			await stream.init(options.effect);

			stream.setInfoEvent(() => {
				return interaction.editReply({ content: 'Play Sound Effect Succefully 🎶!' });
			});

			client.connection.join(channel);
			client.connection
				.newBotPlayer((<any>interaction).message)
				?.playMusic(stream.get(), true);
		}
	};

	readonly autocomplete = async (interaction: AutocompleteInteraction<CacheType>, client: BotClient): Promise<void> => {
		if (interaction.options.getSubcommand() === 'play') {
			const data = await client.getDatabase().getCacheGlobal();
			if (data?.soundEffects) {
				await interaction.respond(
					data.soundEffects.map((choice) => ({
						name: choice.key,
						value: choice.url,
					}))
				);
			}
		}
	};
}

export const command = new SoundEffectCommand();
