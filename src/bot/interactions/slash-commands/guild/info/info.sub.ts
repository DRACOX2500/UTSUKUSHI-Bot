import { GuildEmbed } from "@/bot/builders/embeds/guild";
import { GuildBanEmbed } from "@/bot/builders/embeds/guild-ban";
import { GuildExtraEmbed } from "@/bot/builders/embeds/guild-extra";
import { UtsukushiBotClient } from "@/bot/client";
import { BotSubSlashCommand } from "@/core/bot-command";
import { ERROR_COMMAND, ERROR_CMD_GUILD } from "@/core/constants";
import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, CacheType, EmbedBuilder, Guild } from "discord.js";

/**
 * @SubSlashCommand `Info`
 *  - `info [id?]` : Show Guild informations
 */
export class InfoSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
            .setName('info')
            .setDescription('Guild informations 🏛️!')
            .addStringOption(option =>
                option
                    .setName("id")
                    .setDescription("Guild ID")
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option
                    .setName("extra")
                    .setDescription("Guild extra data")
            )
            .addBooleanOption(option =>
                option
                    .setName("ban")
                    .setDescription("Banned users list")
            );
		return super.set(subcommand);
	}

    override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<void> {
        const optionId = interaction.options.getString('id');
        let guild: Guild | null;
        try {
            if (optionId) guild = await client.guilds.fetch(optionId);
            else guild = interaction.guild;
        } catch (error) {
            guild = null;
        }

        if (!guild) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
            throw new Error(ERROR_COMMAND);
		}

        const isOrigin = guild === interaction.guild;

        const optionExtra = interaction.options.getBoolean('extra');
        const optionBan = interaction.options.getBoolean('ban');

        await interaction.deferReply();

        const embeds: EmbedBuilder[] = [];

        const owner = await guild.members.fetch(guild.ownerId);
        const user = await guild.members.fetch(interaction.user.id);

        embeds.push(new GuildEmbed(guild, owner, user));

        const emojis = await guild.emojis.fetch();
        const stickers = await guild.stickers.fetch();
        const roles = await guild.roles.fetch();

        if (optionExtra && isOrigin) embeds.push(
            new GuildExtraEmbed(
                guild,
                emojis.map(_emoji => _emoji),
                stickers.map(_stickers => _stickers),
                roles.map(_roles => _roles),
            )
        );

        const bans = await guild.bans.fetch();

        if (optionBan && isOrigin) embeds.push(
            new GuildBanEmbed(
                guild,
                bans.map(_ban => _ban),
            )
        );

		await interaction.editReply({ embeds });
    }
}