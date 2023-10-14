import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, bold, type AutocompleteInteraction, type CacheType } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_PLAYER_USED, ERROR_VOICE_CHANNEL, ERROR_CMD_VC, ERROR_CMD_MESSAGE, ERROR_CMD_SONG } from '../../../../../core/constants';
import { type UtsukushiBotClient } from '../../../../client';

/**
 * @SubSlashCommand `play`
 */
export class SetAnthemSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('set-anthem')
			.setDescription('Set the sound-effect you want to play when you join voice channel 🔊!')
			.addStringOption(option =>
				option
					.setName('sound-effect')
					.setDescription('Sound-Effect search query')
					.setRequired(true)
					.setAutocomplete(true),
			);
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient,
	): Promise<void> {
		const query = interaction.options.getString('sound-effect', true);

		await interaction.deferReply({ ephemeral: true });

		const se = await client.store.guilds.getSoundEffect(query);
		if (se) {
			try {
				await client.store.users.updateAnthem(interaction.user, se);
				await interaction.editReply(`Your anthem is set ${bold(se.name)}`);
			}
			catch (error: any) {
				if (error.message === ERROR_PLAYER_USED) interaction.followUp('Do `/music stop` before using sound effects');
				else if (error.message === ERROR_VOICE_CHANNEL) interaction.followUp(ERROR_CMD_VC);
				else await interaction.followUp(ERROR_CMD_MESSAGE);
				throw error;
			}
		}
		else await interaction.editReply(ERROR_CMD_SONG);
	};

	override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const guild = interaction.guild ?? undefined;
		const focusedOption = interaction.options.getFocused(true);

		const results = await client.store.guilds.getAllSoundEffects(guild);
		if (results.length > 0) {
			interaction.respond(
				results
					.filter(
						(t) => focusedOption.value.length === 0 || t.name?.toLowerCase().includes(focusedOption.value.toLowerCase()),
					)
					.slice(0, 25)
					.map((t) => ({
						name: t.name,
						value: t.url,
					})),
			);
		}
	}
}