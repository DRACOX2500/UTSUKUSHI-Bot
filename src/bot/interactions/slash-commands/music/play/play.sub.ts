import { UtsukushiBotClient } from "../../../../client";
import { BotSubSlashCommand } from "../../../../../core/bot-command";
import { ERROR_CMD_GUILD, ERROR_CMD_MESSAGE, ERROR_CMD_SONG, ERROR_CMD_VC, ERROR_COMMAND, ERROR_QUERY, ERROR_VOICE_CHANNEL } from "../../../../../core/constants";
import { PlayerService } from "../../../../../services/player-service";
import { ChatInputCommandInteraction, CacheType, AutocompleteInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { TrackAddedEmbed } from "../../../../builders/embeds/track-added";
import { SongService } from "../../../../../services/database/song-service";

/**
 * @SlashCommand `play`
 *  - `play` : play song !
 */
export class PlaySubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

    override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
            .setName('play')
            .setDescription('Play Music 🎵!')
            .addStringOption(option =>
                option
                    .setName('song')
                    .setDescription('The song you want to play')
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option
                    .setName('source')
                    .setDescription('the source of your song')
                    .addChoices(...PlayerService.sourceChoices)
            );
		return super.set(subcommand);
	}

    override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<any> {
        const guild = interaction.guild;
        if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
            throw new Error(ERROR_COMMAND);
		}


        let query = interaction.options.getString('song');
        const source = interaction.options.getString('source') ?? undefined;

        await interaction.deferReply();

        if (!query) {
            const guildData = await client.store.guilds.getItem(guild.id);
            if (guildData?.lastPlay) {
                query = guildData.lastPlay.url;
            }
            else {
                await interaction.editReply(ERROR_CMD_SONG);
                throw new Error(ERROR_QUERY);
            }
        }

        try {
            const { track } = await PlayerService.searchAndPlay(interaction, query, source);

            const embed = new TrackAddedEmbed(track);
            await interaction.followUp({ embeds: [embed] });

            SongService.saveTrack(track, client, interaction);
        } catch (error: any) {
            if (error.message === ERROR_VOICE_CHANNEL) interaction.followUp(ERROR_CMD_VC);
            else await interaction.followUp(ERROR_CMD_MESSAGE);
            throw error;
        }
    }

    override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const query = interaction.options.getString('song', true);
        const source = interaction.options.getString('source') ?? undefined;
        if (query?.length > 0) {
            const results = await PlayerService.search(interaction, query, source);
            if (results.tracks.length > 0) {
                interaction.respond(
                    results.tracks.slice(0, 10).map((t) => ({
                        name: `${t.title} - ${t.author}`,
                        value: t.url
                    }))
                );
            }
        }
    }
}