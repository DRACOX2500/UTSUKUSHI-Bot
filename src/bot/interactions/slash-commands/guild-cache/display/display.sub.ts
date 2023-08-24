import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, codeBlock } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { DiscordService } from '../../../../../services/discord-service';
import { type UtsukushiBotClient } from '../../../../client';


/**
 * @SubSlashCommand `display`
 *  - `display [visibility?]` : show guild data
 */
export class DisplaySubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('display')
			.setDescription('Show guild data from database 👁️!')
			.addStringOption(option =>
				option
					.setName('visibility')
					.setDescription('Visibility option for the reply (default: private)')
					.addChoices(...[
						{
							name: 'private',
							value: 'private',
						},
						{
							name: 'public',
							value: 'public',
						},
					]),
			);
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

		const option = interaction.options.getString('visibility') ?? 'private';
		if (option === 'private') await interaction.deferReply({ ephemeral: true });
		else await interaction.deferReply();

		const guildData = await client.store.guilds.getItem(guild.id);
		if (!guildData) await interaction.editReply('❌ No Guild data in database !');
		else {
			const json = JSON.stringify(guildData, null, '\t');
			const safetext = DiscordService.limitText(json, 1950);
			await interaction.editReply(codeBlock('json', safetext));
		}
	};
}
