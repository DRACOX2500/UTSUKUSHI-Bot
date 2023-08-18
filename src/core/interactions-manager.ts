import fs from 'node:fs';
import path from 'node:path';

import { BotAutocompleteSlashCommand, BotSlashCommand } from "./types/bot-command";
import logger from './logger';
import { environment } from '@/environment';
import { BotClient } from './bot-client';
import { CacheType, Interaction, REST, Routes } from 'discord.js';
import { BotButton, BotTrigger, CommandManagerConfig } from './types/bot-interaction';
import { ConfigJson, PrivateiInteraction } from '@/types/business';
import CONFIG_JSON from 'config';
import { Array } from './utils/array';

const CONFIG: ConfigJson = CONFIG_JSON;

const INTERACTION_PATH = [
    environment.SRC_PATH,
    'bot',
    'interactions',
]

const DEFAULT_CONFIG: CommandManagerConfig = {
    buttonsPath: [
        ...INTERACTION_PATH,
        'buttons'
    ],
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
    private _buttons: Record<string, BotButton> = {};
    private _commands: Record<string, BotSlashCommand> = {};

    constructor(
        client: BotClient | null = null,
        config: CommandManagerConfig = DEFAULT_CONFIG
    ) {
        this.client = client;
        this.config = config;
        this.loadSlashCommands();
        this.loadTriggers();
        this.loadButtons();
    }

    // private privateSlashCommand(command: BotSlashCommand) {
    //     const privateCmd = CONFIG.private.slashCommands.find(_cmd => _cmd.command === command.command.name);
    //     if (privateCmd) command.guildIds = privateCmd.guildIds;
    // }

    private loadSlashCommands(): void
    {
        const commandsPath = path.join(...this.config.commandsPath);

		const list = this.importPaths(commandsPath, /\.cmd\.[jt]s$/);

		for (const file of list) {
			const command: BotSlashCommand = require(file).command;
			if (!command) continue;

            // this.privateSlashCommand(command);
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

    private loadButtons(): void
    {
        if (!this.client) return;
        const commandsPath = path.join(...this.config.buttonsPath);

		const list = this.importPaths(commandsPath, /\.btn\.[jt]s$/);

		for (const file of list) {
			const button: BotButton = require(file).button;
			if (!button) continue;

            this._buttons[(button.button.data as any).custom_id] = button;
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

    async deployGuild(privateI: PrivateiInteraction): Promise<number>
    {
        const guildId = privateI.guild;
        const cmdList = privateI.commands;
        if (guildId?.length > 0) {
            const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);
            const cmds = cmdList.map(name => this._commands[name]);

            return (async (): Promise<number> => {
                try {
                    logger.botStartGuildDeployCommand(guildId);

                    await rest.put(Routes.applicationGuildCommands(environment.CLIENT_ID, guildId), {
                        body: cmds.map(_cmd => _cmd.command),
                    });

                    logger.botFinishGuildDeployCommand(guildId, this.size(cmds));
                }
                catch (error) {
                    logger.error(error);
                    return 1;
                }
                return 0;
            })();
        }
        return 1;
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
        const privateCmdNames = Array.removeDuplicate(CONFIG.private.map((_private) => _private.commands).flat());
        const cmds = this.commandsList
            .filter(_cmd => !privateCmdNames.includes(_cmd.command.name));

        CONFIG.private.forEach((_private) => this.deployGuild(_private))

        return (async (): Promise<number> => {
			try {
				logger.botStartDeployCommand();

				await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
					body: cmds.map(_cmd => _cmd.command),
				});

				logger.botFinishDeployCommand(this.size(cmds));
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
        if (interaction.isAutocomplete()) {
            (this._commands[interaction.commandName] as BotAutocompleteSlashCommand).autocomplete(interaction, client);
        }
        else if (interaction.isChatInputCommand()) {
            try {
                logger.chatCommand(interaction);
                await this._commands[interaction.commandName].result(interaction, client);
            } catch (error) {
                logger.error(`Command ${interaction.commandName} : Command Error`, error);
            }
        }
        else if (interaction.isButton()) {
            try {
                logger.button(interaction);
                await this._buttons[interaction.customId].result(interaction, client);
            } catch (error) {
                logger.error(`Button ${interaction.customId} : Command Error`, error);
            }
        }
    }
}