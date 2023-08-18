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
	SlashCommandSubcommandGroupBuilder,
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
	result(
		interaction: I,
		client: T,
		options?: Partial<BotCommandOptions>
	): Promise<void>;
}

interface SharedSubSlashCommand<T extends BotClient = BotClient, O = any> {
	/**
	 * @Command SubSlashCommand
	 */
	readonly command: SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
	result(
		interaction: ChatInputCommandInteraction,
		client: T,
		options?: O
	): Promise<void>;
}

interface AutocompleteCommand<T extends BotClient = BotClient> {
	/**
	 * Function that responds to the AutocompleteInteraction
	 */
	autocomplete(
		interaction: AutocompleteInteraction,
		client: T
	): Promise<void>;
}

export interface BotSlashCommand<
	T extends BotClient = BotClient,
	B extends BotSubGroupSlashCommand<T, any> | BotSubSlashCommand<T, any> = BotSubSlashCommand<T, any>
>
	extends BotCommand<T, ChatInputCommandInteraction>, AutocompleteCommand<T> {
	/**
	 * Set guild ID if you want to deploy this command on a specific guild,
	 * else this command will be deploy globally
	 */
	guildIds: string[];
	/**
	 * SubCommands list
	 */
	readonly cmds: Record<string, B>;
	/**
	 * @Command SlashCommand
	 */
	command: BotSlashCommandType;
}

export interface BotSubGroupSlashCommand<T extends BotClient = BotClient, O = any>
	extends SharedSubSlashCommand<T, O> {
	/**
	 * SubCommands list
	 */
	readonly cmds: Record<string, BotSubSlashCommand<T>>;
	/**
	 * @Command SubSlashCommand
	 */
	readonly command: SlashCommandSubcommandGroupBuilder;
	set(subCommandGroup: SlashCommandSubcommandGroupBuilder): SlashCommandSubcommandGroupBuilder;
}

export interface BotSubSlashCommand<T extends BotClient = BotClient, O = any>
	extends SharedSubSlashCommand<T, O>, AutocompleteCommand<T> {
	/**
	 * @Command SubSlashCommand
	 */
	readonly command: SlashCommandSubcommandBuilder;
	set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder;
}

export interface BotContextCommand<
	T extends BotClient = BotClient,
	I extends ContextMenuCommandInteraction = ContextMenuCommandInteraction
> extends Omit<BotCommand<T, ContextMenuCommandInteraction>, 'result'> {
	/**
	 * @Command ContextMenuCommand
	 */
	readonly command: ContextMenuCommandBuilder;
	result(
		interaction: I,
		client: T,
		options?: Partial<BotCommandOptions>
	): Promise<void>;
}

export interface BotMessageContextCommand<T extends BotClient = BotClient>
	extends BotContextCommand<T, MessageContextMenuCommandInteraction> {}

export interface BotUserContextCommand<T extends BotClient = BotClient>
	extends BotContextCommand<T, UserContextMenuCommandInteraction> {}
