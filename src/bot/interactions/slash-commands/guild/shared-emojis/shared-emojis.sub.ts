import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, type CacheType } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_GUILD, ERROR_COMMAND } from '../../../../../core/constants';
import { type UtsukushiBotClient } from '../../../../client';


/**
 * @SubSlashCommand `Shared-Emojis`
 *  - `shared-emojis [enabled]` : Enabled/Disabled share emojis
 */
export class SharedEmojisSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('share-emojis')
			.setDescription('Guild share emoji with Utsukushi and other guilds 😀!')
			.addBooleanOption((option) =>
				option
					.setName('on-off')
					.setDescription('Enable or disable guild share emoji')
					.setRequired(true),
			);
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}
		const guild = interaction.guild;
		const option = interaction.options.getBoolean('on-off', true);

		await interaction.deferReply({ ephemeral: true });

		if (option) client.store.guilds
			.enableSharedEmojis(guild)
			.then(async () => await interaction.editReply('✅ Emojis added to database successfully !'))
			.catch(async () => await interaction.editReply('❌ Emojis added to database failed !'));
		else client.store.guilds
			.disableSharedEmojis(guild)
			.then(async () => await interaction.editReply('✅ Emojis deleted to database successfully !'))
			.catch(async () => await interaction.editReply('❌ Emojis deleted to database failed !'));
	}
}