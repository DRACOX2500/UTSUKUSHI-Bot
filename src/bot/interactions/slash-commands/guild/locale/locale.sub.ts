import { UtsukushiBotClient } from "@/bot/client";
import { BotClient } from "@/core/bot-client";
import { BotSubSlashCommand } from "@/core/bot-command";
import { ERROR_COMMAND, ERROR_CMD_GUILD } from "@/core/constants";
import { DiscordService } from "@/services/discord-service";
import { SlashCommandSubcommandBuilder, AutocompleteInteraction, CacheType, ChatInputCommandInteraction, Locale } from 'discord.js';

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
                        'Change the locale of the guild (only 25 first locale in alphabetical order)'
                    )
                    .setAutocomplete(true)
                    .setRequired(true)
            );
		return super.set(subcommand);
	}

    override async result(interaction: ChatInputCommandInteraction<CacheType>, client: BotClient, options?: any): Promise<void> {
        if (!interaction.guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
            throw new Error(ERROR_COMMAND);
		}

        const guild = interaction.guild;
		const langage = interaction.options.getString('locale', true) as Locale;

        await interaction.deferReply({ ephemeral: true });
		await guild.setPreferredLocale(langage);
		await interaction.editReply('🌐 Guild set locale Succefully !');
    }

    override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const focusedOption = interaction.options.getFocused(true);
		const completions = DiscordService.languages
			.filter(
				(_language) => _language.toLowerCase().includes(focusedOption.value.toLowerCase())
			).map(_language => ({
				name: _language,
				value: _language,
			}));
		await interaction.respond(DiscordService.limitAutoCompletion(completions));
    }
}