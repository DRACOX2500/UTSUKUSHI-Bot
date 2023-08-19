import { AutocompleteInteraction, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';
import { BotClient } from "./bot-client";
import {
	BotSlashCommand as BotSlashCommandType,
	BotSubSlashCommand as BotSubSlashCommandType,
	BotSubGroupSlashCommand as BotSubGroupSlashCommandType,
	BotMessageContextCommand,
	BotCommandOptions
} from './types/bot-command';
import { BotButton as BotButtonType } from './types/bot-interaction';

class AbstractCommand<
	T extends BotClient = BotClient,
	B extends BotSubGroupSlashCommandType<T, any> | BotSubSlashCommandType<T, any> = BotSubSlashCommandType<T, any>
> {
	cmds: Record<string, B>;

	constructor(cmds: Record<string, B> = {}) {
		this.cmds = cmds;
	}

	protected execSubResult(
		cmdName: string,
		interaction: ChatInputCommandInteraction,
		client: T,
		options?: any
	) {
		this.cmdsList.find(_cmd => _cmd.command.name === cmdName)?.result(interaction, client, options);
	}

	get cmdsList(): B[] {
		const list: B[] = [];
		for (const key in this.cmds) {
			list.push(this.cmds[key]);
		}
		return list;
	}

	protected isGroup(sub: B): boolean {
		return sub instanceof BotSubGroupSlashCommand;
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: T,
		options?: any
	): Promise<void> {
		const subCommand = interaction.options.getSubcommand();
		if (subCommand && this.cmdsList.length) this.execSubResult(
			subCommand,
			interaction,
			client,
			options
		);
	};
}

export abstract class BotSlashCommand<
	T extends BotClient = BotClient,
	B extends BotSubGroupSlashCommandType<T, any> | BotSubSlashCommandType<T, any> = BotSubSlashCommandType<T, any>
	>
	extends AbstractCommand<T, B>
	implements BotSlashCommandType<T, B> {
	guildIds: string[];
    command: SlashCommandBuilder;

	constructor(cmds: Record<string, B> = {}, guildIds: string[] = []) {
		super(cmds)
		this.guildIds = guildIds;
		this.command = new SlashCommandBuilder();
		this.cmdsList.forEach(
			(sub) => this.isGroup(sub) ?
				this.command.addSubcommandGroup(_s => (sub as BotSubGroupSlashCommandType<T, any>).set(_s)) :
				this.command.addSubcommand(_s => (sub as BotSubSlashCommandType<T, any>).set(_s))
		);
	}

	async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: T): Promise<void> {
        const subCommand = interaction.options.getSubcommand();
		if (subCommand) (this.cmds[subCommand] as BotSubSlashCommand).autocomplete(
			interaction,
			client
		);
    }
}

export abstract class BotSubGroupSlashCommand<T extends BotClient = BotClient, O = any>
	extends AbstractCommand<T>
	implements BotSubGroupSlashCommandType<T, O> {
	command!: SlashCommandSubcommandGroupBuilder;

	constructor(cmds: Record<string, BotSubSlashCommandType<T, any>> = {}) {
		super(cmds);
	}
	set(subCommandGroup: SlashCommandSubcommandGroupBuilder): SlashCommandSubcommandGroupBuilder {
		this.command = subCommandGroup;
		return this.command;
	}
}

export abstract class BotSubSlashCommand<T extends BotClient = BotClient, O = any>
	implements BotSubSlashCommandType<T, O> {
	command!: SlashCommandSubcommandBuilder;

	set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		this.command = subcommand;
		return this.command;
	}
	async result(interaction: ChatInputCommandInteraction<CacheType>, client: T, options?: O | undefined): Promise<void> {
		// OVERRIDE
	}
	async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: T): Promise<void> {
        // OVERRIDE
    }
}

export abstract class BotContextCommand<T extends BotClient = BotClient, O = any>
	implements BotMessageContextCommand<T> {
	command!: ContextMenuCommandBuilder;

	constructor() {
		this.command = new ContextMenuCommandBuilder();
	}

	async result(
		interaction: MessageContextMenuCommandInteraction<CacheType>,
		client: T,
		options?: Partial<BotCommandOptions> | undefined): Promise<void> {
		// OVERRIDE
	};

}

export abstract class BotButtonBuilder extends ButtonBuilder {
	constructor(id: string, disable: boolean = false) {
		super();

        this
            .setCustomId(id)
            .setDisabled(disable);
	}
}

export abstract class BotButton<T extends BotClient = BotClient> implements BotButtonType<T> {
	button!: BotButtonBuilder;
	async result(interaction: ButtonInteraction<CacheType>, client: T): Promise<void> {
		// OVERRIDE
	}
}

export class BotModal<T extends BotClient = BotClient> extends ModalBuilder {
	custom_id: string;
	constructor(id: string) {
		super();
		this.custom_id = id;
		this.setCustomId(this.custom_id);
	}

	async result(interaction: ModalSubmitInteraction, client: T): Promise<void> {
		// OVERRIDE
	}
}

export class BotSelectBuilder extends StringSelectMenuBuilder {
    custom_id: string;
    constructor(id: string) {
        super();
        this.custom_id = id;

        this.setCustomId(this.custom_id);
    }
}

export class BotSelect<T extends BotClient = BotClient> extends ModalBuilder {
	select!: BotSelectBuilder;
	async result(interaction: StringSelectMenuInteraction, client: T): Promise<void> {
		// OVERRIDE
	}
}