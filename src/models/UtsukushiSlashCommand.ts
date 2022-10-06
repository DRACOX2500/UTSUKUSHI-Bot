import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BotClient } from 'src/BotClient';

export interface UtsukushiSlashCommand {

	readonly slash: SlashCommandBuilder,
    readonly result: (interaction: ChatInputCommandInteraction, client: BotClient) => void,
}