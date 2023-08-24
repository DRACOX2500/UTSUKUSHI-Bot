import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, type CacheType, Locale, type AutocompleteInteraction } from 'discord.js';
import { type BotClient } from '../../../../../core/bot-client';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { DiscordService } from '../../../../../services/discord-service';
import { type UtsukushiBotClient } from '../../../../client';


/**
 * @SubSlashCommand `locale`
 *  - `locale` : ...
 */
export class LocaleSubCommand extends BotSubSlashCommand {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('locale')
			.setDescription('Update guild locale language (default: English-US) 🌐!')
			.addStringOption((option) =>
				option
					.setName('language')
					.setDescription(
						'Change the locale of the guild (only 25 first locale in alphabetical order)',
					)
					.setAutocomplete(true)
					.setRequired(true),
			);
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: BotClient, options?: any): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		const guild = interaction.guild;
		const option = interaction.options.getString('language', true) as keyof typeof Locale;
		const langage = Locale[option];

		await interaction.deferReply({ ephemeral: true });
		await guild.setPreferredLocale(langage);
		await interaction.editReply('🌐 Guild set locale Succefully !');
	}

	override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const focusedOption = interaction.options.getFocused(true);
		const completions = DiscordService.languages
			.filter(
				(_language) => _language.toLowerCase().includes(focusedOption.value.toLowerCase()),
			).map(_language => ({
				name: _language,
				value: _language,
			}));
		await interaction.respond(DiscordService.limitAutoCompletion(completions));
	}
}