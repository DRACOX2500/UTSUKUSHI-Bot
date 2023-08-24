import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, bold } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../../client';

/**
 * @SubSlashCommand `historic`
 *  - `historic` : enable/disable user historic
 */
export class HistoricSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('historic')
			.setDescription('Enable/disable user historic 📖!')
			.addBooleanOption(option =>
				option
					.setName('enable')
					.setDescription('Enable or disable')
					.setRequired(true),
			);
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient,
	): Promise<void> {
		const user = interaction.user;
		const option = interaction.options.getBoolean('enable', true);

		await interaction.deferReply({ ephemeral: true });

		await client.store.users.updateHistoric(user, option);
		await interaction.editReply(`Historic ${bold(option ? 'enabled' : 'disabled')} 📖 !`);
	};
}