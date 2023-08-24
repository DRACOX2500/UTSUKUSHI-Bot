import { type ChatInputCommandInteraction, type CacheType, type SlashCommandSubcommandBuilder, type AutocompleteInteraction } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { PlayerService } from '../../../../../services/player-service';
import { type UtsukushiBotClient } from '../../../../client';
import { DiscordService } from '../../../../../services/discord-service';
import { Sort } from '../../../../../core/utils/sort';

/**
 * @SlashCommand `filter`
 *  - `filter` : skip player filters !
 */
export class FilterSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('filter')
			.setDescription('Set player filters 🎵! (🧪 experimental)')
			.addStringOption(option =>
				option
					.setName('filter')
					.setDescription('Player filter')
					.setRequired(true)
					.setAutocomplete(true),
			);
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<any> {
		const guild = interaction.guild;
		if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		const option = interaction.options.getString('filter', true);

		await PlayerService.enableFilter(guild, option);
		await interaction.reply({ content: `Filter **${option}** enabled !`, ephemeral: true });
	}

	override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const guild = interaction.guild;
		if (!guild) return;

		const focusedOption = interaction.options.getFocused(true);
		const filters = PlayerService.filters
			.filter(
				(_filter) => _filter.toLowerCase().includes(focusedOption.value.toLowerCase()),
			)
			.sort((a, b) => Sort.byName(a, b));

		const completions = PlayerService.autocompletionsFilters(guild, filters);

		interaction.respond(DiscordService.limitAutoCompletion(completions));
	}
}