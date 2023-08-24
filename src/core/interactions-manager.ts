import fs from 'node:fs';
import path from 'node:path';

import { type BotContextCommand, type BotSlashCommand } from './types/bot-command';
import logger from './logger';
import { environment } from '../environment';
import { type BotClient } from './bot-client';
import { type CacheType, type Interaction, REST, Routes } from 'discord.js';
import { type BotButton, type BotTrigger, type CommandManagerConfig } from './types/bot-interaction';
import { type ConfigJson, type PrivateiInteraction } from '../types/business';
import CONFIG_JSON from '../../config.json';
import { ArrayUtils } from './utils/array';
import { type BotModal, type BotSelect } from './bot-command';

const CONFIG: ConfigJson = CONFIG_JSON;

const INTERACTION_PATH = [
	environment.SRC_PATH,
	'bot',
	'interactions',
];

const DEFAULT_CONFIG: CommandManagerConfig = {
	buttonsPath: [
		...INTERACTION_PATH,
		'buttons',
	],
	commandsPath: [
		...INTERACTION_PATH,
		'slash-commands',
	],
	triggersPath: [
		...INTERACTION_PATH,
		'triggers',
	],
	contextPath: [
		...INTERACTION_PATH,
		'contexts',
	],
	modalsPath: [
		...INTERACTION_PATH,
		'modals',
	],
	selectsPath: [
		...INTERACTION_PATH,
		'selects',
	],
};

export class InteractionsManager {

	config: CommandManagerConfig;

	private readonly client: BotClient | null;
	private _buttons: Record<string, BotButton> = {};
	private _commands: Record<string, BotSlashCommand> = {};
	private _contexts: Record<string, BotContextCommand> = {};
	private _modals: Record<string, BotModal> = {};
	private _selects: Record<string, BotSelect> = {};

	constructor(
		client: BotClient | null = null,
		config: CommandManagerConfig = DEFAULT_CONFIG,
	) {
		this.client = client;
		this.config = config;
		this.loadSlashCommands();
		this.loadContexts();
		this.loadTriggers();
		this.loadButtons();
		this.loadModals();
		this.loadSelects();
	}

	private loadSlashCommands(): void {
		const commandsPath = path.join(...this.config.commandsPath);

		const list = this.importPaths(commandsPath, /\.cmd\.[jt]s$/);

		for (const file of list) {
			const command: BotSlashCommand = require(file).command;
			if (!command) continue;

			this._commands[command.command.name] = command;
		}
	}

	private loadSelects(): void {
		const commandsPath = path.join(...this.config.selectsPath);

		const list = this.importPaths(commandsPath, /\.slc\.[jt]s$/);

		for (const file of list) {
			const select: BotSelect = require(file).select;
			if (!select) continue;

			this._selects[select.select.custom_id] = select;
		}
	}

	private loadContexts(): void {
		const commandsPath = path.join(...this.config.contextPath);

		const list = this.importPaths(commandsPath, /\.ctx\.[jt]s$/);

		for (const file of list) {
			const context: BotContextCommand = require(file).context;
			if (!context) continue;

			this._contexts[context.command.name] = context;
		}
	}

	private loadTriggers(): void {
		if (!this.client) return;
		const commandsPath = path.join(...this.config.triggersPath);

		const list = this.importPaths(commandsPath, /\.trigger\.[jt]s$/);

		for (const file of list) {
			const trigger: BotTrigger = require(file).trigger;
			if (!trigger) continue;

			trigger.trigger(this.client);
		}
	}

	private loadButtons(): void {
		if (!this.client) return;
		const commandsPath = path.join(...this.config.buttonsPath);

		const list = this.importPaths(commandsPath, /\.btn\.[jt]s$/);

		for (const file of list) {
			const button: BotButton = require(file).button;
			if (!button) continue;

			this._buttons[(button.button.data as any).custom_id] = button;
		}
	}

	private loadModals(): void {
		if (!this.client) return;
		const commandsPath = path.join(...this.config.modalsPath);

		const list = this.importPaths(commandsPath, /\.mdl\.[jt]s$/);

		for (const file of list) {
			const modal: BotModal = require(file).modal;
			if (!modal) continue;

			this._modals[modal.custom_id] = modal;
		}
	}

	private importPaths(
		absolutePath: string,
		regex?: RegExp,
	): string[] {
		const list: string[] = [];
		try {
			fs.readdirSync(absolutePath).forEach((filefolder) => {
				const pathFile = path.join(absolutePath, filefolder);

				if (regex?.exec(filefolder)) {
					list.push(pathFile);
				}
				else if (fs.statSync(pathFile).isDirectory()) {
					list.push(...this.importPaths(pathFile, regex));
				}
			});
		}
		catch (err) {
			logger.error('Not .js or .ts files', err);
		}
		return list.flat();
	}

	private sizesub(command: BotSlashCommand): number {
		let curr = 0;
		for (const key in command.cmds) {
			const cmd = command.cmds[key];
			if ((cmd as any).cmds)
				curr += Object.keys((cmd as any).cmds).length;
			else curr += 1;
		}
		if (curr === 0) return 1;
		return curr;
	}

	private size(cmds: BotSlashCommand[]): number {
		return cmds.reduce((curr, cmd) => this.sizesub(cmd) + curr, 0);
	}

	get commands(): Record<string, BotSlashCommand> {
		return this._commands;
	}

	get commandsList(): BotSlashCommand[] {
		const list = [];
		for (const key in this._commands) {
			list.push(this._commands[key]);
		}
		return list;
	}

	get contextsList(): BotContextCommand[] {
		const list = [];
		for (const key in this._contexts) {
			list.push(this._contexts[key]);
		}
		return list;
	}

	async resetGuild(guildId: string): Promise<void> {
		if (guildId?.length === 0) return;
		await (async () => {
			const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);

			try {
				logger.botStartGuildResetCommand(guildId);

				await rest.put(Routes.applicationGuildCommands(environment.CLIENT_ID, guildId), {
					body: [],
				});

				logger.botFinishGuildResetCommand(guildId);
			}
			catch (error) {
				logger.error('Reset Guild Commands', error);
			}
		})();
	}

	async deployGuild(privateI: PrivateiInteraction): Promise<number> {
		const guildId = privateI.guild;
		const cmdList = privateI.commands;
		const ctxList = privateI.contexts;
		if (guildId?.length > 0) {
			const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);
			const cmds = cmdList.map(name => this._commands[name]);
			const ctxs = ctxList.map(name => this._contexts[name]);

			const body = [
				...cmds.map(_cmd => _cmd.command),
				...ctxs.map(_ctx => _ctx.command),
			];

			return await (async (): Promise<number> => {
				try {
					logger.botStartGuildDeployCommand(guildId);

					await rest.put(Routes.applicationGuildCommands(environment.CLIENT_ID, guildId), {
						body,
					});

					logger.botFinishGuildDeployCommand(guildId, this.size(cmds), ctxs.length);
				}
				catch (error) {
					logger.error('Deploy Guild Commands', error);
					return 1;
				}
				return 0;
			})();
		}
		return 1;
	}

	async resetAll(): Promise<void> {
		await (async () => {
			const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);

			try {
				logger.botStartResetCommand();

				await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
					body: [],
				});

				logger.botFinishResetCommand();
			}
			catch (error) {
				logger.error('Reset All Commands', error);
			}
		})();
	}

	async deployAll(): Promise<number> {
		const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);
		const privateCmdNames = ArrayUtils.removeDuplicate(CONFIG.private.map((_private) => _private.commands).flat());
		const privateCtxNames = ArrayUtils.removeDuplicate(CONFIG.private.map((_private) => _private.contexts).flat());
		const cmds = this.commandsList
			.filter(_cmd => !privateCmdNames.includes(_cmd.command.name));
		const ctxs = this.contextsList
			.filter(_ctx => !privateCtxNames.includes(_ctx.command.name));

		CONFIG.private.forEach(async (_private) => await this.deployGuild(_private));

		const body = [
			...cmds.map(_cmd => _cmd.command),
			...ctxs.map(_ctx => _ctx.command),
		];

		return await (async (): Promise<number> => {
			try {
				logger.botStartDeployCommand();

				await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
					body,
				});

				logger.botFinishDeployCommand(this.size(cmds), ctxs.length);
			}
			catch (error) {
				logger.error('Deploy All Commands', error);
				return 1;
			}
			return 0;
		})();
	}

	async handleInteractions(
		interaction: Interaction<CacheType>,
		client: BotClient,
	): Promise<void> {
		if (interaction.isAutocomplete()) {
			this._commands[interaction.commandName].autocomplete(interaction, client);
		}
		else if (interaction.isModalSubmit()) {
			try {
				logger.modal(interaction);
				await this._modals[interaction.customId].result(interaction, client);
			}
			catch (error) {
				logger.error(`Modal ${interaction.customId} : Command Error`, error);
			}
		}
		else if (interaction.isStringSelectMenu()) {
			try {
				logger.select(interaction);
				await this._selects[interaction.customId].result(interaction, client);
			}
			catch (error) {
				logger.error(`Select ${interaction.customId} : Command Error`, error);
			}
		}
		else await this.handleInteractions2(interaction, client);
	}

	private async handleInteractions2(
		interaction: Interaction<CacheType>,
		client: BotClient,
	): Promise<void> {
		if (interaction.isChatInputCommand()) {
			try {
				logger.chatCommand(interaction);
				await this._commands[interaction.commandName].result(interaction, client);
			}
			catch (error) {
				logger.error(`Command ${interaction.commandName} : Command Error`, error);
			}
		}
		else if (interaction.isButton()) {
			try {
				logger.button(interaction);
				await this._buttons[interaction.customId].result(interaction, client);
			}
			catch (error) {
				logger.error(`Button ${interaction.customId} : Command Error`, error);
			}
		}
		else if (interaction.isContextMenuCommand()) {
			try {
				logger.context(interaction);
				await this._contexts[interaction.commandName].result(interaction, client);
			}
			catch (error) {
				logger.error(`Context ${interaction.commandName} : Command Error`, error);
			}
		}
	}
}