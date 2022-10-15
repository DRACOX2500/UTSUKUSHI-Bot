/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionsBitField,
	AutocompleteInteraction,
	CacheType,
	ChannelType,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiAutocompleteSlashCommand } from '@models/UtsukushiCommand';
import { NotifyCommandOptions, NotifySubCommand } from './notify.sub';
import { sortByName } from '@utils/sortByName';

/**
 * @SlashCommand `notify`
 * @AutocompleteInteraction
 * @DefaultMemberPermissions `ManageGuild`
 * - `notify [channel]` : set **TextChannel** to notify when guild members join voice channel
 */
export class NotifyCommand
	extends NotifySubCommand
	implements UtsukushiAutocompleteSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('notify')
		.setDescription('Notify when someone join a voice channel 🔔!')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('on')
				.setDescription('Notify when someone join a voice channel 🔔!')
				.addStringOption((option) =>
					option
						.setName('channel')
						.setDescription('Disable the notification system in your guild 🔕!')
						.setAutocomplete(true)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('off')
				.setDescription('Play Sound Effect in Vocal Channel 🔊🎶!')
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {
		const subCommand = interaction.options.getSubcommand();

		// SubCommand  => On
		if (subCommand === 'on') {
			const options: NotifyCommandOptions = {
				channel: interaction.options.getString('channel') ?? '',
			};
			if (options.channel === '') {
				interaction.reply('❌ Channel setup Failed !');
				return;
			}
			await this.on(interaction, client, options);
		}
		// SubCommand  => off
		else if (subCommand === 'off') {
			await this.off(interaction, client);
		}
	};

	readonly autocomplete = async (
		interaction: AutocompleteInteraction<CacheType>,
		client: BotClient
	): Promise<void> => {
		const textchannel = interaction.guild?.channels.cache.filter(
			(channel) => channel.type === ChannelType.GuildText
		);
		if (textchannel) {
			let res = textchannel.map((choice) => ({
				name: choice.name,
				value: choice.id,
			}));
			res = res.sort((a, b) => sortByName(a.name, b.name));
			res.unshift({ name: '---', value: '-1' });
			if (res.length >= 25) res = res.slice(0, 25);
			await interaction.respond(res);
		}
	};
}

export const command = new NotifyCommand();
