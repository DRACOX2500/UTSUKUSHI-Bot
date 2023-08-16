import fs from 'node:fs';
import path from 'node:path';

import { BotAutocompleteSlashCommand, BotSlashCommand } from "./types/bot-command";
import logger from './logger';
import { environment } from '@/environment';
import { BotClient } from './bot-client';
import { CacheType, Interaction, REST, Routes } from 'discord.js';
import { ERROR_COMMAND } from './constants';
import { BotTrigger } from './types/bot-interaction';

interface CommandManagerConfig {
    commandsPath: string[];
    triggersPath: string[];
    contextPath: string[];
}

const INTERACTION_PATH = [
    environment.SRC_PATH,
    'bot',
    'interactions',
]

const DEFAULT_CONFIG = {
    commandsPath: [
        ...INTERACTION_PATH,
        'slash-commands'
    ],
    triggersPath: [
        ...INTERACTION_PATH,
        'triggers'
    ],
    contextPath: [
        ...INTERACTION_PATH,
        'contexts'
    ],
}

export class InteractionsManager {

    config: CommandManagerConfig;

    private client: BotClient | null;
    private _commands: Record<string, BotSlashCommand> = {};

    constructor(
        client: BotClient | null = null,
        config: CommandManagerConfig = DEFAULT_CONFIG
    ) {
        this.client = client;
        this.config = config;
        this.loadSlashCommands();
        this.loadTriggers();
    }

    private loadSlashCommands(): void
    {
        const commandsPath = path.join(...this.config.commandsPath);

		const list = this.importPaths(commandsPath, /\.cmd\.[jt]s$/);

		for (const file of list) {
			const command: BotSlashCommand = require(file).command;
			if (!command) continue;

			this._commands[command.command.name] = command;
		}
    }

    private loadTriggers(): void
    {
        if (!this.client) return;
        const commandsPath = path.join(...this.config.triggersPath);

		const list = this.importPaths(commandsPath, /\.trigger\.[jt]s$/);

		for (const file of list) {
			const trigger: BotTrigger = require(file).trigger;
			if (!trigger) continue;

			trigger.trigger(this.client);
		}
    }

    private importPaths(
		absolutePath: string,
		regex?: RegExp
	): string[] {
        const list: string[] = []
		try {
			fs.readdirSync(absolutePath).forEach((filefolder) => {
				const pathFile = path.join(absolutePath, filefolder);

                if (regex?.exec(filefolder)) {
                    list.push(pathFile);
                } else if (fs.statSync(pathFile).isDirectory()) {
					list.push(...this.importPaths(pathFile, regex));
				}
			});
		}
		catch (err) {
			// Not .js or .ts files
            logger.error(err);
		}
        return list.flat();
	}

    private sizesub(command: BotSlashCommand): number {
        let curr = 0;
        for (const key in command.cmds) {
            const cmd = command.cmds[key];
            if ((cmd as any).cmds)
                curr += Object.keys((cmd as any).cmds).length
            else curr += 1;
        }
        if (curr === 0) return 1;
        return curr;
    }

    private size(cmds: BotSlashCommand[]): number {
        return cmds.reduce((curr, cmd) => this.sizesub(cmd) + curr, 0);
    }

    get commands(): Record<string, BotSlashCommand>
    {
        return this._commands;
    }

    get commandsList(): BotSlashCommand[]
    {
        const list = [];
        for (const key in this._commands) {
            list.push(this._commands[key]);
        }
        return list;
    }

    async resetGuild(guildId: string): Promise<void>
    {
        if (guildId?.length === 0) return;
        return (async () => {
            const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);

            try {
                logger.botStartGuildResetCommand(guildId);

                await rest.put(Routes.applicationGuildCommands(environment.CLIENT_ID, guildId), {
					body: [],
				});

                logger.botFinishGuildResetCommand(guildId);
            }
            catch (error) {
                logger.error(error);
            }
        })();
    }

    async deployGuild(guildId: string): Promise<number>
    {
        const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);
        const cmds = this.commandsList
            .filter(cmd => cmd.guildIds?.includes(guildId))
            .map(_cmd => _cmd.command);

        return (async (): Promise<number> => {
			try {
				logger.botStartGuildDeployCommand(guildId);

				await rest.put(Routes.applicationGuildCommands(environment.CLIENT_ID, guildId), {
					body: cmds,
				});

				logger.botFinishGuildDeployCommand(guildId, cmds.length);
			}
			catch (error) {
				logger.error(error);
				return 1;
			}
			return 0;
		})();
    }

    async resetAll(): Promise<void>
    {
        return (async () => {
            const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);

            try {
                logger.botStartResetCommand();

                await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
					body: [],
				});

                logger.botFinishResetCommand();
            }
            catch (error) {
                logger.error(error);
            }
        })();
    }

    async deployAll(): Promise<number>
    {
        const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);
        const cmds = this.commandsList.map(_cmd => _cmd.command);

        return (async (): Promise<number> => {
			try {
				logger.botStartDeployCommand();

				await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
					body: cmds,
				});

				logger.botFinishDeployCommand(this.size(this.commandsList));
			}
			catch (error) {
				logger.error(error);
				return 1;
			}
			return 0;
		})();
    }

    async handleInteractions(
        interaction: Interaction<CacheType>,
        client: BotClient
    ): Promise<void>
    {
        if (interaction.isChatInputCommand()) {
            if (!client) {
                interaction.reply(ERROR_COMMAND);
                logger.error(`Command ${interaction.commandName} : No client !`);
            }
            else {
                try {
                    logger.info(`[SlashCommand] ${interaction.user.username} : ${interaction.commandName}`);
                    await this._commands[interaction.commandName].result(interaction, client);
                } catch (error) {
                    logger.error(`Command ${interaction.commandName} : Command Error`, error);
                }
            }
        }
        else if (interaction.isAutocomplete()) {
            (this._commands[interaction.commandName] as BotAutocompleteSlashCommand).autocomplete(interaction, client);
        }
    }
}