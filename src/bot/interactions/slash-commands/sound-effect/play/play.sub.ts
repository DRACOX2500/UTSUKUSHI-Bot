import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, type AutocompleteInteraction, type CacheType, bold } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../../client';
import { PlayerService } from '../../../../../services/player-service';
import { ERROR_CMD_MESSAGE, ERROR_CMD_SONG, ERROR_CMD_VC, ERROR_PLAYER_USED, ERROR_VOICE_CHANNEL } from '../../../../../core/constants';

/**
 * @SubSlashCommand `play`
 */
export class PlaySubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('play')
			.setDescription('Play sound-effect 🔊!')
			.addStringOption(option =>
				option
					.setName('query')
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
		const query = interaction.options.getString('query', true);

		await interaction.deferReply({ ephemeral: true });

		const se = await client.store.guilds.getSoundEffect(query);
		if (se) {
			try {
				await PlayerService.playSoundEffect(interaction, se.url);
				await interaction.editReply(`Now playing ${bold(se.name)}`);
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