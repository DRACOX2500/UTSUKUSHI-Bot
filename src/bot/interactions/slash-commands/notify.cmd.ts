import { UtsukushiBotClient } from "@/bot/client";
import { ERROR_COMMAND } from "@/core/constants";
import { logger } from "@/core/logger";
import { BotAutocompleteSlashCommand } from "@/core/types/bot-command";
import { Sort } from "@/core/utils/sort";
import { DiscordService } from "@/services/discord-service";
import { SlashCommandBuilder, PermissionsBitField, ChatInputCommandInteraction, AutocompleteInteraction, CacheType, ChannelType } from "discord.js";


/**
 * @SlashCommand `notify`
 * @AutocompleteInteraction
 * @DefaultMemberPermissions `ManageGuild`
 * - `notify [channel]` : set **TextChannel** to notify when guild members join voice channel
 */
export class NotifyCommand implements BotAutocompleteSlashCommand<UtsukushiBotClient> {
	readonly command = new SlashCommandBuilder()
		.setName('notify')
		.setDescription('Notify when someone join a voice channel 🔔!')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
		.addStringOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel you want to be notified !')
				.setAutocomplete(true)
				.setRequired(true)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient
	): Promise<void> => {
		if (!interaction.guild) throw new Error(ERROR_COMMAND);
		await interaction.deferReply();

		const channel = interaction.options.getString('channel', true);
		if (channel === '-1') {
			client.store.guilds.updateNotify(interaction.guild, null);
		}
		else client.store.guilds.updateNotify(interaction.guild, channel);
		interaction.editReply('🔔 Channel updated successfully !').catch((err: Error) => logger.error(err.message));
	};

	readonly autocomplete = async (
		interaction: AutocompleteInteraction<CacheType>,
		_client: UtsukushiBotClient
	): Promise<void> => {
		const channels = interaction.guild?.channels.cache
		if (channels) {
			const focusedOption = interaction.options.getFocused(true);
			const completions = channels
				.filter((choice) =>
					choice.type === ChannelType.GuildText &&
					choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
				)
				.map((choice) => ({
					name: choice.name,
					value: choice.id,
				}))
				.sort((a, b) => Sort.byName(a.name, b.name));
			completions.unshift({ name: '---', value: '-1' });

			await interaction.respond(DiscordService.limitAutoCompletion(completions));
		}
		else await interaction.respond([]);
	};
}

export const command = new NotifyCommand();
