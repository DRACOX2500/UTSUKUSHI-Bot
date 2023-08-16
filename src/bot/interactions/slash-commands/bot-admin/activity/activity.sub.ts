import { UtsukushiBotClient } from "@/bot/client";
import { ERROR_COMMAND, ERROR_CMD_MESSAGE, TWITCH_LINK } from "@/core/constants";
import { logger } from "@/core/logger";
import { BotSubSlashCommand } from "@/core/bot-command";
import { BotActivity } from "@/core/types/business";
import { BotSubCommandOptions } from "@/types/commands";
import { SlashCommandSubcommandBuilder, SlashCommandIntegerOption, ActivityType, SlashCommandStringOption, ChatInputCommandInteraction, CacheType } from "discord.js";

export const NAME = 'activity'

/**
 * @SubSlashCommand
 */
export class ActivitySubCommand extends BotSubSlashCommand<UtsukushiBotClient, BotSubCommandOptions> {

    override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
        subcommand
            .setName('activity')
            .setDescription('Change Bot activity 🤖!')
            .addIntegerOption((option: SlashCommandIntegerOption) =>
                option
                    .setName('activity-type')
                    .setDescription('Type of bot activity')
                    .addChoices(
                        { name: 'Play', value: ActivityType.Playing },
                        { name: 'Listen', value: ActivityType.Listening },
                        { name: 'Stream', value: ActivityType.Streaming },
                        { name: 'Competing', value: ActivityType.Competing },
                        { name: 'Watch', value: ActivityType.Watching }
                    )
                    .setRequired(true)
            )
            .addStringOption((option: SlashCommandStringOption) =>
                option
                    .setName('activity-message')
                    .setDescription('Message of bot activity')
                    .setRequired(true)
            );
        return super.set(subcommand);
    }

    async result(
        interaction: ChatInputCommandInteraction<CacheType>,
        client: UtsukushiBotClient,
        options?: BotSubCommandOptions) : Promise<void>
	{
        if (!options) {
			await interaction.reply({ content: ERROR_CMD_MESSAGE, ephemeral: true });
            throw new Error(ERROR_COMMAND);
		}

        const newActivity: BotActivity = {
            status: options.activityMessage,
            code: options.activityType,
            url: TWITCH_LINK,
        };

        client.setActivity(newActivity);

        client.store.updateActivity(newActivity);
        interaction.reply({
            content: '🤖 Bot activity has been change !',
            ephemeral: true,
        }).catch((err: Error) => logger.error({}, err.message));
	};
}