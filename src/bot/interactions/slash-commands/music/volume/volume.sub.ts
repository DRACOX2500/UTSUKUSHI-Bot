import { type ChatInputCommandInteraction, type CacheType, type SlashCommandSubcommandBuilder } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { PlayerService } from '../../../../../services/player-service';
import { type UtsukushiBotClient } from '../../../../client';

/**
 * @SlashCommand `volume`
 *  - `volume` : volume the current song !
 */
export class VolumeSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('volume')
			.setDescription('Set the music volume 🎵!')
			.addIntegerOption(option =>
				option
					.setName('volume')
					.setDescription('Volume value between 0 to 100')
					.setMinValue(0)
					.setMaxValue(100)
					.setRequired(true),
			);
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<any> {
		const guild = interaction.guild;
		if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		const option = interaction.options.getInteger('volume', true);

		await PlayerService.setVolume(guild, option);
		await interaction.reply({ content: 'Volume updated !', ephemeral: true });
	}
}