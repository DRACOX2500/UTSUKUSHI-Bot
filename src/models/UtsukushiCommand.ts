import {
	CommandInteraction,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction,
} from 'discord.js';
import { BotClient } from 'src/BotClient';

type UtsukushiCommandType =
	| SlashCommandBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	| ContextMenuCommandBuilder;

export interface UtsukushiCommandOptions {
	test_error?: boolean;
}

export interface UtsukushiCommand<T extends CommandInteraction> {
	readonly command: UtsukushiCommandType;
	readonly result: (
		interaction: T,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiSlashCommand
	extends UtsukushiCommand<ChatInputCommandInteraction> {
	readonly command:
		| SlashCommandBuilder
		| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	readonly result: (
		interaction: ChatInputCommandInteraction,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiContextCommand
	extends UtsukushiCommand<ContextMenuCommandInteraction> {
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: ContextMenuCommandInteraction,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}
