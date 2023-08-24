import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { type UtsukushiBotClient } from '../../../../client';


/**
 * @SubSlashCommand `remove`
 *  - `remove` : remove guild data
 */
export class RemoveSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('remove')
			.setDescription('Remove guild data from database 💥!');
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient,
	): Promise<void> {
		const guild = interaction.guild;
		if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		await interaction.deferReply({ ephemeral: true });

		client.store.guilds.removeItemByGuild(guild)
			.then(async () => await interaction.editReply('✅ Guild data removed successfully !'))
			.catch(async () => await interaction.editReply('❌ Failed to remove Guild data !'));
	};
}
