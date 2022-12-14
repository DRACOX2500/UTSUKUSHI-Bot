/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionsBitField,
	AutocompleteInteraction,
	CacheType,
	ChannelType,
} from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { UtsukushiAutocompleteSlashCommand } from '@models/utsukushi-command.model';
import { NotifyCommandOptions, NotifySubCommand } from './notify.sub';
import { Sort } from '@utils/sort';

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
						.setDescription('The channel you want to be notified !')
						.setAutocomplete(true)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('off')
				.setDescription('Disable the notification system in your guild 🔕!')
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const subCommand = interaction.options.getSubcommand(true);

		// SubCommand  => On
		if (subCommand === 'on') {
			const options: NotifyCommandOptions = {
				channel: interaction.options.getString('channel', true),
			};
			await this.on(interaction, client, options);
		}
		// SubCommand  => off
		else if (subCommand === 'off') {
			await this.off(interaction, client);
		}
	};

	readonly autocomplete = async (
		interaction: AutocompleteInteraction<CacheType>,
		client: UtsukushiClient
	): Promise<void> => {
		const textchannel = interaction.guild?.channels.cache.filter(
			(channel) => channel.type === ChannelType.GuildText
		);
		if (textchannel) {
			const focusedOption = interaction.options.getFocused(true);
			let res = textchannel.map((choice) => ({
				name: choice.name,
				value: choice.id,
			}));
			res = res.filter((choice) =>
				choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
			);
			res = res.sort((a, b) => Sort.byName(a.name, b.name));
			res.unshift({ name: '---', value: '-1' });
			if (res.length >= 25) res = res.slice(0, 25);
			await interaction.respond(res);
		}
	};
}

export const command = new NotifyCommand();
