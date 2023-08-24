import { type SlashCommandSubcommandBuilder, type ChatInputCommandInteraction, bold } from 'discord.js';
import { BotSubSlashCommand } from '../../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../../client';
import { PlayerService } from '../../../../../services/player-service';
import { ERROR_CMD_SONG, ERROR_CMD_SONG_DURATION } from '../../../../../core/constants';
import { type SoundEffect } from '../../../../../types/business';

/**
 * @SubSlashCommand `add`
 */
export class AddSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('add')
			.setDescription('Add sound-effect 🔊! (max: 0:30)')
			.addStringOption(option =>
				option
					.setName('title')
					.setDescription('Sound-effect title')
					.setRequired(true),
			)
			.addStringOption(option =>
				option
					.setName('url')
					.setDescription('Sound-effect youtube URL')
					.setRequired(true),
			)
			.addBooleanOption(option =>
				option
					.setName('public')
					.setDescription('Sound-effect is public or just for the current guild ? (default: true)'),
			);
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient,
	): Promise<void> {
		let guild = interaction.guild ?? undefined;
		const title = interaction.options.getString('title', true);
		const url = interaction.options.getString('url', true);
		const isPublic = interaction.options.getBoolean('public') ?? true;

		if (isPublic) guild = undefined;

		await interaction.deferReply({ ephemeral: true });

		const search = await PlayerService.search(interaction, url, 'youtube');

		if (search.tracks.length > 0) {
			if (search.tracks[0].durationMS <= 30000) {
				const doc = await client.store.users.getOrAddDocByUser(interaction.user);
				const se: SoundEffect = {
					name: title,
					url: search.tracks[0].url,
					user: doc,
				};

				await client.store.guilds.addSoundEffect(se, guild);

				await interaction.editReply(`🎵 Sound-Effect ${bold(title)} added !`);
			}
			else {
				await interaction.editReply(ERROR_CMD_SONG_DURATION);
			}
		}
		else await interaction.editReply(ERROR_CMD_SONG);
	};
}