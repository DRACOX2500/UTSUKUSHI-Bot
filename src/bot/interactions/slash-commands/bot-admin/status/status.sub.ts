import { UtsukushiBotClient } from "@/bot/client";
import { ERROR_COMMAND } from "@/core/constants";
import { logger } from "@/core/logger";
import { BotSubSlashCommand } from "@/core/bot-command";
import { BotSubCommandOptions } from "@/types/commands";
import { SlashCommandSubcommandBuilder, SlashCommandStringOption, ChatInputCommandInteraction, CacheType, PresenceStatusData } from "discord.js";

/**
 * @SubCommand
 */
export class BotStatusSubCommand extends BotSubSlashCommand<UtsukushiBotClient, BotSubCommandOptions> {
    name: string = 'status';

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
        subcommand
            .setName(this.name)
            .setDescription('Change Bot status 🤖!')
            .addStringOption((option: SlashCommandStringOption) =>
                option
                    .setName('status-type')
                    .setDescription('Type of bot activity')
                    .addChoices(
                        { name: 'Online', value: 'online' },
                        { name: 'Idle', value: 'idle' },
                        { name: 'Do Not Disturb', value: 'dnd' },
                        { name: 'Invisible', value: 'invisible' }
                    )
                    .setRequired(true)
            );
        return super.set(subcommand);
    }

	async result(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiBotClient,
		options?: BotSubCommandOptions) : Promise<void>
	{
		if (!options) throw new Error(ERROR_COMMAND);

		client.setStatus(options.status as PresenceStatusData);

		client.store.updateStatus(options.status as PresenceStatusData);
		interaction.reply({
			content: '🤖 Bot status has been change !',
			ephemeral: true,
		}).catch((err: Error) => logger.error({}, err.message));
	};
}