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

/**
 * @SlashCommand
 * @AutocompleteInteraction
 * @DefaultMemberPermissions `ManageGuild`
 * - `notify [channel]` : set **TextChannel** to notify when guild members join voice channel
 */
export class NotifyCommand implements UtsukushiAutocompleteSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('notify')
		.setDescription('Notify when someone join a voice channel 🔔!')
		.addStringOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel you want me to notify')
				.setAutocomplete(true)
				.setRequired(true)
		)
		.setDefaultMemberPermissions(
			PermissionsBitField.Flags.ManageGuild
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {

		await interaction.deferReply();
		const channelId = <string | null>interaction.options.get('channel')?.value;

		if (interaction.guild && channelId) {

			if (channelId === '-1') {
				client
					.getDatabase()
					.setCacheByGuild(interaction.guild, { vocalNotifyChannel: null });
				interaction.editReply('🔕 Notify Channel Removed successfully !');
			}
			else {
				client
					.getDatabase()
					.setCacheByGuild(interaction.guild, {
						vocalNotifyChannel: channelId,
					});
				interaction.editReply('🔔 Channel setup successfully !');
			}
		}
		else {
			interaction.editReply('❌ Channel setup Failed !');
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

			const res = textchannel.map((choice) => ({
				name: choice.name,
				value: choice.id,
			}));
			res.unshift(
				{ name: '---', value: '-1' }
			);
			await interaction.respond(res);
		}
	};
}

export const command = new NotifyCommand();
