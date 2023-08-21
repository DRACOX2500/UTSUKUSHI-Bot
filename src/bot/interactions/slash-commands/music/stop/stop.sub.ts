import { ChatInputCommandInteraction, CacheType, SlashCommandSubcommandBuilder } from "discord.js";
import { BotSubSlashCommand } from "../../../../../core/bot-command";
import { PlayerService } from "../../../../../services/player-service";
import { UtsukushiBotClient } from "../../../../client";
import { ERROR_CMD_GUILD, ERROR_COMMAND } from "../../../../../core/constants";

/**
 * @SlashCommand `stop`
 *  - `stop` : stop song !
 */
export class StopSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('stop')
			.setDescription('Stop Music 🎵!');
		return super.set(subcommand);
	}

    override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<any> {
        const guild = interaction.guild;
        if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
            throw new Error(ERROR_COMMAND);
		}

        PlayerService.stop(guild)
        await interaction.reply({ content: 'Music stopped !', ephemeral: true });
    }
}