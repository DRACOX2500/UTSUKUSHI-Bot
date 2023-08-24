import { type ChatInputCommandInteraction, type CacheType, type SlashCommandSubcommandBuilder } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { PlayerService } from '../../../../../services/player-service';
import { type UtsukushiBotClient } from '../../../../client';

/**
 * @SlashCommand `skip`
 *  - `skip` : skip the current song !
 */
export class SkipSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('skip')
			.setDescription('Skip the current 🎵!');
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<any> {
		const guild = interaction.guild;
		if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		PlayerService.skip(guild);
		await interaction.reply({ content: 'Song skipped !', ephemeral: true });
	}
}