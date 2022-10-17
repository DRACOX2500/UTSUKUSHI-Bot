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
import { UtsukushiClient } from 'src/utsukushi-client';

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

/**
 * Command to deploy on specific guild
 */
export interface UtsukushiPrivateCommand {
	/**
	 * Set guild ID if you want to deploy this command on a specific guild,
	 * else this command will be deploy globally
	 */
	readonly guildId: string[] | null | undefined;
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
		client: UtsukushiClient,
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
		client: UtsukushiClient,
		options?: UtsukushiCommandOptions
	) => Promise<void>;
}

export interface UtsukushiContextCommand<
	T extends ContextMenuCommandInteraction
> extends Omit<UtsukushiCommand<ContextMenuCommandInteraction>, 'result'> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: T,
		client: UtsukushiClient,
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
		client: UtsukushiClient,
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
		client: UtsukushiClient,
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
		client: UtsukushiClient
	) => Promise<void>;
}
