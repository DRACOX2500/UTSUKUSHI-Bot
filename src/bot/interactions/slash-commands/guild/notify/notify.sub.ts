import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, type CacheType, type AutocompleteInteraction, ChannelType } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { SortUtils } from '../../../../../core/utils/sort';
import { DiscordService } from '../../../../../services/discord-service';
import { type UtsukushiBotClient } from '../../../../client';


/**
 * @SubSlashCommand `Notify`
 *  - `notify [channel]` : set **TextChannel** to notify when guild members join voice channel
 */
export class NotifySubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('notify')
			.setDescription('Notify when someone join a voice channel 🔔!')
			.addStringOption((option) =>
				option
					.setName('channel')
					.setDescription('The channel you want to be notified !')
					.setAutocomplete(true)
					.setRequired(true),
			);
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}
		await interaction.deferReply();

		const channel = interaction.options.getString('channel', true);
		if (channel === '-1') {
			client.store.guilds.updateNotify(interaction.guild, null);
		}
		else client.store.guilds.updateNotify(interaction.guild, channel);
		await interaction.editReply('🔔 Channel updated successfully !');
	}

	override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const channels = interaction.guild?.channels.cache;
		if (channels) {
			const focusedOption = interaction.options.getFocused(true);
			const completions = channels
				.filter((choice) =>
					choice.type === ChannelType.GuildText &&
					choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()),
				)
				.map((choice) => ({
					name: choice.name,
					value: choice.id,
				}))
				.sort((a, b) => SortUtils.byName(a.name, b.name));
			completions.unshift({ name: '---', value: '-1' });

			await interaction.respond(DiscordService.limitAutoCompletion(completions));
		}
		else await interaction.respond([]);
	}
}