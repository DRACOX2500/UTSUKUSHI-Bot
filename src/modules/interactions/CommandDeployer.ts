/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Collection,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	REST,
	Routes,
	SlashCommandBuilder,
	UserContextMenuCommandInteraction,
} from 'discord.js';
import {
	UtsukushiSlashCommand,
	UtsukushiContextCommand,
	UtsukushiPrivateCommand,
	UtsukushiCommand,
} from '@models/UtsukushiCommand';
import { lightGreen, green, lightMagenta, magenta } from 'ansicolor';

type CommandDeployerOptions = {
    /** default true */
	enableLogs: boolean;
};

export class CommandDeployer {
	/** Collection<CommandName, Command> */
	globals!: Collection<string, UtsukushiSlashCommand>;

	/** Map<GuildID, Collection<CommandName, Command>> */
	commandGuilds!: Map<string, Map<string, UtsukushiSlashCommand>>;

	/** Collection<ContextName, Context> */
	contexts!: Collection<
		string,
		UtsukushiContextCommand<
			MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction
		>
	>;

	constructor(
		private DISCORD_TOKEN: string,
		private CLIENT_ID: string,
		readonly commands: Collection<string, UtsukushiSlashCommand>,
		contexts: Collection<
			string,
			UtsukushiContextCommand<
				MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction
			>
		>
	) {
		this.globals = commands.clone();
		this.contexts = contexts;
		this.commandGuilds = new Map();

		const tmp = this.globals;

		this.globals.forEach((value, key) => {
			const guildIDs = (<UtsukushiPrivateCommand>(<unknown>value)).guildId;
			if (guildIDs) {
				guildIDs.forEach((guild) => {
					const guildscommand = this.commandGuilds.get(guild);
					this.commandGuilds.set(
						guild,
						guildscommand ? guildscommand.set(key, value) : new Map().set(key, value)
					);
				});
				tmp.delete(key);
			}
		});
	}

	get globalAndContext(): Collection<string, UtsukushiCommand<any>> {
		return new Collection<string, UtsukushiCommand<any>>().concat(
			this.globals,
			this.contexts
		);
	}

	async deployGlobal(
		options?: CommandDeployerOptions
	): Promise<number> {
		const rest = new REST({ version: '10' }).setToken(this.DISCORD_TOKEN);

		const botCommands: (SlashCommandBuilder | ContextMenuCommandBuilder)[] = [];
		const cmds = this.globalAndContext;

		for (const iterator of cmds) {
			const value = cmds.get(iterator[0]);
			if (value)
				botCommands.push(
					<SlashCommandBuilder | ContextMenuCommandBuilder>value.command
				);
		}

		return (async (): Promise<number> => {
			try {
				if (options?.enableLogs ?? true)
					console.log(
						lightGreen('Started refreshing application global (/) commands...')
					);

				await rest.put(Routes.applicationCommands(this.CLIENT_ID), {
					body: botCommands,
				});

				if (options?.enableLogs ?? true)
					console.log(
						green(`Successfully reloaded application ${botCommands.length} global (/) commands !`)
					);
			}
			catch (error) {
				console.error(error);
				return 1;
			}
			return 0;
		})();
	}

	async deployPrivate(options?: CommandDeployerOptions): Promise<void> {
		const rest = new REST({ version: '10' }).setToken(this.DISCORD_TOKEN);

		this.commandGuilds.forEach((value, key) => {
			const botCommands: (SlashCommandBuilder | ContextMenuCommandBuilder)[] = [];
			const cmds = value;

			for (const iterator of cmds) {
				const val = cmds.get(iterator[0]);
				if (val)
					botCommands.push(
						<SlashCommandBuilder | ContextMenuCommandBuilder>val.command
					);
			}

			return (async (): Promise<void> => {
				try {
					if (options?.enableLogs ?? true)
						console.log(
							lightMagenta(
								`Started refreshing application private [${key}] (/) commands...`
							)
						);

					await rest.put(Routes.applicationGuildCommands(this.CLIENT_ID, key), {
						body: botCommands,
					});

					if (options?.enableLogs ?? true)
						console.log(
							magenta(
								`Successfully reloaded application ${botCommands.length} private [${key}] (/) commands !`
							)
						);
				}
				catch (error) {
					console.error(error);
				}
			})();
		});
	}
}
