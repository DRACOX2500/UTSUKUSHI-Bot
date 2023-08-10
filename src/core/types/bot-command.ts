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
import { BotClient } from '../bot-client';

type BotSlashCommandType =
	| SlashCommandBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	| SlashCommandSubcommandsOnlyBuilder;

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
	readonly guildId: string[] | null | undefined;
}

export interface BotCommand<T extends CommandInteraction> {
	/**
	 * @Command SlashCommand | ContextMenuCommand
	 */
	readonly command: BotCommandType;
	/**
	 * Function that responds to the command
	 */
	readonly result: (
		interaction: T,
		client: BotClient,
		options?: BotCommandOptions
	) => Promise<void>;
}

export interface BotSlashCommand
	extends BotCommand<ChatInputCommandInteraction> {
	/**
	 * @Command SlashCommand
	 */
	readonly command: BotSlashCommandType;
	readonly result: (
		interaction: ChatInputCommandInteraction,
		client: BotClient,
		options?: BotCommandOptions
	) => Promise<void>;
}

export interface BotContextCommand<
	T extends ContextMenuCommandInteraction
> extends Omit<BotCommand<ContextMenuCommandInteraction>, 'result'> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: T,
		client: BotClient,
		options?: BotCommandOptions
	) => Promise<void>;
}

export interface BotMessageContextCommand
	extends BotContextCommand<MessageContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: MessageContextMenuCommandInteraction,
		client: BotClient,
		options?: BotCommandOptions
	) => Promise<void>;
}

export interface BotUserContextCommand
	extends BotContextCommand<UserContextMenuCommandInteraction> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	readonly result: (
		interaction: UserContextMenuCommandInteraction,
		client: BotClient,
		options?: BotCommandOptions
	) => Promise<void>;
}

export interface BotAutocompleteSlashCommand
	extends BotSlashCommand {
	/**
	 * Function that responds to the AutocompleteInteraction
	 */
	readonly autocomplete: (
		interaction: AutocompleteInteraction,
		client: BotClient
	) => Promise<void>;
}
