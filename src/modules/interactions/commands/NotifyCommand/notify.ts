/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	GuildMember,
	PermissionsBitField,
	AutocompleteInteraction,
	CacheType,
	ChannelType,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiAutocompleteSlashCommand } from '@models/UtsukushiCommand';

export class NotifyCommand implements UtsukushiAutocompleteSlashCommand {
	readonly command: Omit<
		SlashCommandBuilder,
		'addSubcommand' | 'addSubcommandGroup'
	> = new SlashCommandBuilder()
			.setName('notify')
			.setDescription('Notify when someone join a voice channel 🔔!')
			.addStringOption((option) =>
				option
					.setName('channel')
					.setDescription('The channel you want me to notify')
					.setAutocomplete(true)
					.setRequired(true)
			);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {
		const m = <GuildMember>interaction.member;
		if (!m.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			interaction
				.reply('🔒 You do not have permission to manage the guild')
				.then(() => {
					setTimeout(
						() =>
							interaction
								.deleteReply()
								.catch((error) => console.log(error.message)),
						3000
					);
				});
			return;
		}

		await interaction.deferReply();
		const channelId = <string | null>interaction.options.get('channel')?.value;

		if (interaction.guild && channelId) {
			const channelIdInCache = await client
				.getDatabase()
				.getCacheByGuild(interaction.guild);

			if (channelIdInCache?.vocalNotifyChannel === channelId) {
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
			await interaction.respond(
				textchannel.map((choice) => ({
					name: choice.name,
					value: choice.id,
				}))
			);
		}
	};
}

export const command = new NotifyCommand();
