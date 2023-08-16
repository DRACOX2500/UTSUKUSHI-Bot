import { UtsukushiBotClient } from "@/bot/client";
import { BotSubSlashCommand } from "@/core/bot-command";
import { ERROR_COMMAND, ERROR_CMD_GUILD } from "@/core/constants";
import { DiscordService } from "@/services/discord-service";
import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";

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
                    .setRequired(true)
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
        const guildEmojis = await guild.emojis.fetch();
        const emojis = DiscordService.toEmojiType(...guildEmojis.map(_emoji => _emoji));

        if (option) client.store.guilds
            .addAllEmoji(guild, emojis)
            .then(() => interaction.editReply('✅ Emojis added to database successfully !'))
            .catch(() => interaction.editReply('❌ Emojis added to database failed !'));
        else client.store.guilds
        .removeAllEmoji(guild)
        .then(() => interaction.editReply('✅ Emojis deleted to database successfully !'))
        .catch(() => interaction.editReply('❌ Emojis deleted to database failed !'));
    }
}