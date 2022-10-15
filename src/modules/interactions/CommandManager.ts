/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-case-declarations */
import fs from 'node:fs';
import path from 'node:path';

import {
	Interaction,
	ChatInputCommandInteraction,
	ButtonInteraction,
	CacheType,
	AutocompleteInteraction,
	ContextMenuCommandInteraction,
	Collection,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction,
	SelectMenuInteraction,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { CommandButton } from './enum';
import { NotifyEvent } from './events/NotifyEvent';
import { ButtonPause } from './button/play/ButtonPause';
import { ButtonVolume } from './button/play/ButtonVolumeDown';
import {
	UtsukushiAutocompleteSlashCommand,
	UtsukushiCommand,
	UtsukushiContextCommand,
	UtsukushiSlashCommand,
} from '@models/UtsukushiCommand';
import { cyan, lightMagenta, magenta } from 'ansicolor';
import { ReactAsBotButton } from './button/react-as-bot/emoji-pagination.button';
import { ReactAsBotSelect } from './selects/react-as-bot/react-as-bot.select';

export class CommandManager {
	commands!: Collection<string, UtsukushiSlashCommand>;
	contexts!: Collection<string, UtsukushiContextCommand<MessageContextMenuCommandInteraction|UserContextMenuCommandInteraction>>;

	constructor(private readonly client: BotClient) {
		this.commands = new Collection();
		this.contexts = new Collection();
		this.loadCommand('commands', this.commands);
		this.loadCommand('contexts', this.contexts);
	}

	get allCollection(): Collection<string, UtsukushiCommand<any>> {
		return new Collection<string, UtsukushiCommand<any>>().concat(
			this.commands,
			this.contexts
		);
	}

	private loadCommand(
		folderTitle: string,
		collection: Collection<string, any>
	) {
		const filesList: string[][] = [];
		const commandsPath = path.join(__dirname, folderTitle);

		this.load(filesList, commandsPath);

		for (const file of filesList.flat()) {
			const command: UtsukushiCommand<any> = require(file).command;
			if (!command) continue;

			collection.set(command.command.name, command);
		}
	}

	private load(filesList: string[][], absolutePath: string): void {
		try {
			fs.readdirSync(absolutePath).forEach((filefolder) => {
				const pathFile = path.join(absolutePath, filefolder);
				if (filefolder.endsWith('.cmd.js')) filesList.push([pathFile]);
				else if (fs.statSync(pathFile).isDirectory()) {
					this.load(filesList, pathFile);
				}
			});
		}
		catch (err) {
			// Not .js files
			return;
		}
	}

	private async interactionChatInput(
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> {
		const command = this.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await Promise.resolve(command.result(interaction, client));
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			}).catch(
				async (error: Error) => {
					if (error.name === 'InteractionAlreadyReplied') {
						await interaction.editReply({
							content: 'There was an error while executing this command!',
						});
					}
				}
			);
		}
	}

	private async interactionContext(
		interaction: ContextMenuCommandInteraction,
		client: BotClient
	): Promise<void> {
		const command = this.contexts.get(interaction.commandName);

		if (!command) return;

		try {
			await Promise.resolve(command.result(<any>interaction, client));
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}

	private async interactionAutocomplete(
		interaction: AutocompleteInteraction<CacheType>,
		client: BotClient
	) {
		(<UtsukushiAutocompleteSlashCommand>(
			this.commands.get(interaction.commandName)
		))?.autocomplete(interaction, client);
	}

	// TODO : auto button management
	private async interactionButton(
		interaction: ButtonInteraction,
		client: BotClient
	): Promise<void> {
		switch (interaction.customId) {
		case CommandButton.VolumeDown:
			await new ButtonVolume(interaction, client).getDownEffect();
			break;
		case CommandButton.Stop:
			client.connection.killConnection();
			await interaction.deferUpdate();
			break;
		case CommandButton.Pause:
			await new ButtonPause(interaction, client).getEffect();
			break;
		case CommandButton.Skip:
			// TODO : skip command
			break;
		case CommandButton.VolumeUp:
			await new ButtonVolume(interaction, client).getUpEffect();
			break;
		case 'rab-next':
			await new ReactAsBotButton.NextButton().getEffect(interaction, client);
			break;
		case 'rab-previous':
			await new ReactAsBotButton.PreviousButton().getEffect(interaction, client);
			break;
		}
	}

	private interactionSelect(interaction: SelectMenuInteraction<CacheType>, client: BotClient) {
		if (interaction.customId === 'rab-select') {
			ReactAsBotSelect.getEffect(interaction, client);
		}
	}

	initCommand(client: BotClient) {
		client.on(
			'interactionCreate',
			async (interaction: Interaction<CacheType>) => {
				if (interaction.isChatInputCommand()) {
					console.log(
						`[${cyan(interaction.user.username)} - #${lightMagenta(interaction.user.id)}] use command : ${magenta(interaction.commandName)}`
					);
					await this.interactionChatInput(interaction, client);
				}
				else if (interaction.isButton()) {
					console.log(
						`[${cyan(interaction.user.username)} - #${lightMagenta(interaction.user.id)}] use button : ${magenta(interaction.customId)}`
					);
					await this.interactionButton(interaction, client);
				}
				else if (interaction.isAutocomplete()) {
					await this.interactionAutocomplete(interaction, client);
				}
				else if (interaction.isContextMenuCommand()) {
					console.log(
						`[${cyan(interaction.user.username)} - #${lightMagenta(interaction.user.id)}] use context : ${magenta(interaction.commandName)}`
					);
					await this.interactionContext(interaction, client);
				}
				else if (interaction.isSelectMenu()) {
					console.log(
						`[${cyan(interaction.user.username)} - #${lightMagenta(interaction.user.id)}] use select : ${magenta(interaction.customId)}`
					);
					await this.interactionSelect(interaction, client);
				}
			}
		);
	}

	initBotEvents(client: BotClient) {
		client.on('voiceStateUpdate', async (oldState, newState) => {
			if (oldState.channelId === newState.channelId) {
				// 'a user has not moved!'
			}
			if (
				oldState.channelId != null &&
				newState.channelId != null &&
				newState.channelId != oldState.channelId
			) {
				// 'a user switched channels'
			}
			if (oldState.channelId === null) {
				if (newState.member?.user.bot) return;
				// 'a user joined!'
				const user = newState.id;
				const channelId = <string>newState.channelId;
				const guild = newState.guild;

				new NotifyEvent().notifyGuild(client, user, channelId, guild);
			}
			if (newState.channelId === null) {
				// 'a user left!'
			}
		});
	}
}
