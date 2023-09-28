import { type UtsukushiBotClient } from '../../../../client';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { ERROR_CMD_MESSAGE, ERROR_CMD_SONG, ERROR_CMD_VC, ERROR_QUERY, ERROR_VOICE_CHANNEL } from '../../../../../core/constants';
import { PlayerService } from '../../../../../services/player-service';
import { type ChatInputCommandInteraction, type CacheType, type AutocompleteInteraction, type SlashCommandSubcommandBuilder } from 'discord.js';
import { TrackAddedEmbed } from '../../../../builders/embeds/track-added';
import { SongService } from '../../../../../services/database/song-service';
import { SortUtils } from '../../../../../core/utils/sort';
import { ConverterUtils } from '../../../../../core/utils/converter';

/**
 * @SlashCommand `play-historic`
 *  - `play-historic` : play song in historic !
 */
export class PlayHistoricSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('play-historic')
			.setDescription('Play Music in historic 🎵! (🧪 experimental)')
			.addStringOption(option =>
				option
					.setName('song')
					.setDescription('The song you want to play')
					.setRequired(true)
					.setAutocomplete(true),
			);
		return super.set(subcommand);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<any> {
		const user = interaction.user;

		const query = interaction.options.getString('song', true);

		await interaction.deferReply();

		if (!query) {
			const userData = await client.store.users.getOrAddItemByUser(user);
			const songsUrls = userData.songs.list.map(song => song.item.url);
			if (!songsUrls.includes(query)) {
				await interaction.editReply(ERROR_CMD_SONG);
				throw new Error(ERROR_QUERY);
			}
		}

		try {
			const { track } = await PlayerService.play(interaction, query);

			const embed = new TrackAddedEmbed(track);
			await interaction.followUp({ embeds: [embed] });

			SongService.saveTrack(track, client, interaction);
		}
		catch (error: any) {
			if (error.message === ERROR_VOICE_CHANNEL) interaction.followUp(ERROR_CMD_VC);
			else await interaction.followUp(ERROR_CMD_MESSAGE);
			throw error;
		}
	}

	override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const user = interaction.user;
		const focusedOption = interaction.options.getFocused(true);

		const userData = await client.store.users.getItem(user.id);
		const results = userData?.songs.list ?? [];
		const choices = results
			.filter(
				(t) => focusedOption.value.length === 0 || t.item.title?.toLowerCase().includes(focusedOption.value.toLowerCase()),
			)
			.sort((a, b) => SortUtils.byDate(a.date, b.date))
			.slice(0, 25)
			.map((t) => ({
				name: `${ConverterUtils.dateToFormat(t.date)} | ${t.item.title ?? ''}`,
				value: t.item.url,
			}));
		interaction.respond(choices);
	}
}