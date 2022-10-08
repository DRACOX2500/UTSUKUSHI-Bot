import {
	CommandInteraction,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction,
	SlashCommandSubcommandsOnlyBuilder,
	AutocompleteInteraction,
	UserContextMenuCommandInteraction,
	MessageContextMenuCommandInteraction,
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

export interface UtsukushiContextCommand<T extends ContextMenuCommandInteraction>
	extends Omit<UtsukushiCommand<ContextMenuCommandInteraction>, 'result'> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: T,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiMessageContextCommand
	extends UtsukushiContextCommand<MessageContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: MessageContextMenuCommandInteraction,
		client: BotClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiUserContextCommand
	extends UtsukushiContextCommand<UserContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: UserContextMenuCommandInteraction,
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
