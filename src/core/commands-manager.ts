import fs from 'node:fs';
import path from 'node:path';

import { BotSlashCommand } from "./types/bot-command";
import { botFinishDeployCommand, botStartDeployCommand, logger } from './logger';
import { environment } from '@/environment';
import { BotClient } from './bot-client';
import { REST, Routes } from 'discord.js';

interface CommandManagerConfig {
    commandsPath: string[];
    contextPath: string[];
}

const DEFAULT_CONFIG = {
    commandsPath: [
        environment.SRC_PATH,
        'bot',
        'interactions',
        'slash-commands'
    ],
    contextPath: [
        environment.SRC_PATH,
        'bot',
        'interactions',
        'contexts'
    ],
}

export class CommandManager {

    config: CommandManagerConfig;

    private client: BotClient | null;
    private _commands: Record<string, BotSlashCommand> = {};

    constructor(
        client: BotClient | null = null,
        config: CommandManagerConfig = DEFAULT_CONFIG
    ) {
        this.client = client;
        this.config = config;
        this.importSlashCommands();
    }

    private importSlashCommands(): void
    {
        const commandsPath = path.join(...this.config.commandsPath);

		const list = this.importPaths(commandsPath, /\.cmd\.[jt]s$/);

		for (const file of list.flat()) {
			const command: BotSlashCommand = require(file).command;
			if (!command) continue;

			this._commands[command.command.name] = command;
		}
    }

    private importPaths(
		absolutePath: string,
		regex?: RegExp
	): string[][] {
        const list: string[][] = []
		try {
			fs.readdirSync(absolutePath).forEach((filefolder) => {
				const pathFile = path.join(absolutePath, filefolder);

                if (regex?.exec(filefolder)) {
                    list.push([pathFile]);
                } else if (fs.statSync(pathFile).isDirectory()) {
					this.importPaths(pathFile, regex);
				}
			});
		}
		catch (err) {
			// Not .js or .ts files
            logger.error(err)
		}
        return list;
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

    deployAll(): Promise<number>
    {
        const rest = new REST({ version: '10' }).setToken(environment.DISCORD_TOKEN);
        const cmds = this.commandsList.map(_cmd => _cmd.command);

        return (async (): Promise<number> => {
			try {
				botStartDeployCommand();

				await rest.put(Routes.applicationCommands(environment.CLIENT_ID), {
					body: cmds,
				});

				botFinishDeployCommand(cmds.length);
			}
			catch (error) {
				console.error(error);
				return 1;
			}
			return 0;
		})();
    }
}