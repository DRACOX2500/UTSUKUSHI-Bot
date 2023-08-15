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
	SlashCommandSubcommandBuilder,
} from 'discord.js';
import { BotClient } from '../bot-client';

type BotSlashCommandType =
	| SlashCommandBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	| SlashCommandSubcommandsOnlyBuilder;

type BotSubSlashCommandType = (subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder

type BotContextCommandType = ContextMenuCommandBuilder;

type BotCommandType =
	| BotSlashCommandType
	| BotContextCommandType;

export interface BotCommandOptions {}

/**
 * Command to deploy on specific guild
 */
export interface BotPrivateCommand {
	/**
	 * Set guild ID if you want to deploy this command on a specific guild,
	 * else this command will be deploy globally
	 */
	readonly guildIds: string[];
}

export interface BotCommand<
	T extends BotClient,
	I extends CommandInteraction
> {
	/**
	 * @Command SlashCommand | ContextMenuCommand
	 */
	readonly command: BotCommandType;
	/**
	 * Function that responds to the command
	 */
	readonly result: (
		interaction: I,
		client: T,
		options?: Partial<BotCommandOptions>
	) => Promise<void>;
}

export interface BotSlashCommand<T extends BotClient = BotClient>
	extends BotCommand<T, ChatInputCommandInteraction> {
	/**
	 * @Command SlashCommand
	 */
	readonly command: BotSlashCommandType;
	readonly result: (
		interaction: ChatInputCommandInteraction,
		client: T,
		options?: Partial<BotCommandOptions>
	) => Promise<void>;
}

export interface BotSubSlashCommand<T extends BotClient = BotClient, O = any> {
	/**
	 * @Command SubSlashCommand
	 */
	readonly subcommand: BotSubSlashCommandType;
	readonly result: (
		interaction: ChatInputCommandInteraction,
		client: T,
		options?: O
	) => Promise<void>;
}

export interface BotContextCommand<
	T extends BotClient,
	I extends ContextMenuCommandInteraction
> extends Omit<BotCommand<T, ContextMenuCommandInteraction>, 'result'> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: I,
		client: T,
		options?: Partial<BotCommandOptions>
	) => Promise<void>;
}

export interface BotMessageContextCommand<T extends BotClient = BotClient>
	extends BotContextCommand<T, MessageContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: MessageContextMenuCommandInteraction,
		client: T,
		options?: Partial<BotCommandOptions>
	) => Promise<void>;
}

export interface BotUserContextCommand<T extends BotClient = BotClient>
	extends BotContextCommand<T, UserContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: UserContextMenuCommandInteraction,
		client: T,
		options?: Partial<BotCommandOptions>
	) => Promise<void>;
}

export interface BotAutocompleteSlashCommand<T extends BotClient = BotClient>
	extends BotSlashCommand<T> {
	/**
	 * Function that responds to the AutocompleteInteraction
	 */
	readonly autocomplete: (
		interaction: AutocompleteInteraction,
		client: T
	) => Promise<void>;
}
