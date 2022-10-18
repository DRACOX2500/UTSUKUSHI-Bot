/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AutocompleteInteraction,
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { UtsukushiAutocompleteSlashCommand } from '@models/utsukushi-command.model';
import {
	SoundEffectCommandOptions,
	SoundEffectSubCommand,
} from './sound-effect.sub';
import { Sort } from '@utils/sort';

/**
 * @SlashCommand `soundeffect`
 * @AutocompleteInteraction
 *  - `soundeffect play [effect]` : Play sound effect
 *  - `soundeffect add [key] [url]` : Add sound effect to the database
 */
export class SoundEffectCommand
	extends SoundEffectSubCommand
	implements UtsukushiAutocompleteSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('soundeffect')
		.setDescription('Sound Effect in Vocal Channel 🎶!')
		.setDMPermission(false)
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
		client: UtsukushiClient
	): Promise<void> => {
		const subCommand = interaction.options.getSubcommand(true);
		const options: SoundEffectCommandOptions = {
			effect: interaction.options.getString('effect') ?? '',
			name: interaction.options.getString('name') ?? '',
			url: interaction.options.getString('url') ?? '',
		};

		// SubCommand  => Add
		if (subCommand === 'add') {
			this.add(interaction, client, options);
		}
		// SubCommand  => Play
		else if (subCommand === 'play') {
			this.play(interaction, client, options);
		}
	};

	readonly autocomplete = async (
		interaction: AutocompleteInteraction<CacheType>,
		client: UtsukushiClient
	): Promise<void> => {
		if (interaction.options.getSubcommand() === 'play') {
			const focusedOption = interaction.options.getFocused(true);
			let data = client.getDatabase().global.getSoundEffects();

			if (data) {
				data = data.filter((choice) =>
					choice.key.toLowerCase().includes(focusedOption.value.toLowerCase())
				);
				data.sort((a, b) => Sort.byName(a.key, b.key));
				if (data.length >= 25) data = data.slice(0, 25);
				await interaction.respond(
					data.map((choice) => ({
						name: choice.key,
						value: choice.url,
					}))
				);
			}
		}
	};
}

export const command = new SoundEffectCommand();
