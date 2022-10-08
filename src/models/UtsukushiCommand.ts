import {
	CommandInteraction,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction,
	SlashCommandSubcommandsOnlyBuilder,
	AutocompleteInteraction,
} from 'discord.js';
import { BotClient } from 'src/BotClient';

type UtsukushiSlashCommandType =
	| SlashCommandBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	| SlashCommandSubcommandsOnlyBuilder;

type UtsukushiContextCommandType = ContextMenuCommandBuilder;

type UtsukushiCommandType =
	| UtsukushiSlashCommandType
	| UtsukushiContextCommandType;

export interface UtsukushiCommandOptions {
	test_error?: boolean;
}

export interface UtsukushiCommand<T extends CommandInteraction> {
	/**
	 * @Command SlashCommand | ContextMenuCommand
	 */
	readonly command: UtsukushiCommandType;
	/**
	 * Function that responds to the command
	 */
	readonly result: (
		interaction: T,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiSlashCommand
	extends UtsukushiCommand<ChatInputCommandInteraction> {
	/**
	 * @Command SlashCommand
	 */
	readonly command: UtsukushiSlashCommandType;
	readonly result: (
		interaction: ChatInputCommandInteraction,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiContextCommand
	extends UtsukushiCommand<ContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: ContextMenuCommandInteraction,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiAutocompleteSlashCommand
	extends UtsukushiSlashCommand {
	/**
	 * Function that responds to the AutocompleteInteraction
	 */
	readonly autocomplete: (
		interaction: AutocompleteInteraction,
		client: BotClient
	) => Promise<void>;
}
