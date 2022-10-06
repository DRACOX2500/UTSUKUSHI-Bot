import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'src/BotClient';

export interface UtsukushiSlashCommand {

	readonly slash: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    readonly result: (interaction: ChatInputCommandInteraction, client: BotClient, options?: UtsukushiSlashCommandOptions) => Promise<void>,
}

export interface UtsukushiSlashCommandOptions {
    test_error?: boolean
}