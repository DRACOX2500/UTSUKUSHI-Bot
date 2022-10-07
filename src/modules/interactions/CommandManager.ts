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
	ChannelType,
	ContextMenuCommandInteraction,
	Collection,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { CommandButton, CommandSlash } from './enum';
import { NotifyEvent } from './events/NotifyEvent';
import { ButtonPause } from './button/play/ButtonPause';
import { ButtonVolume } from './button/play/ButtonVolumeDown';
import {
	UtsukushiCommand,
	UtsukushiContextCommand,
	UtsukushiSlashCommand,
} from '@models/UtsukushiCommand';

export class CommandManager {
	commands!: Collection<string, UtsukushiSlashCommand>;
	contexts!: Collection<string, UtsukushiContextCommand>;

	constructor(private readonly client: BotClient) {
		this.commands = new Collection();
		this.contexts = new Collection();
		this.loadCommand('commands', this.commands);
		this.loadCommand('contexts', this.contexts);
	}

	get allCollection(): Collection<string, UtsukushiCommand<any>> {
		return new Collection<string, UtsukushiCommand<any>>().concat(this.commands, this.contexts);
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

			collection.set(command.command.name, command);
		}
	}

	private load(filesList: string[][], absolutePath: string): void {
		try {
			fs.readdirSync(absolutePath).forEach((filefolder) => {
				const pathFile = path.join(absolutePath, filefolder);
				if (filefolder.endsWith('.js')) filesList.push([pathFile]);
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
			});
		}
	}

	private async interactionContext(
		interaction: ContextMenuCommandInteraction,
		client: BotClient
	): Promise<void> {
		const command = this.contexts.get(interaction.commandName);

		if (!command) return;

		try {
			await Promise.resolve(command.result(interaction, client));
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}

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
		}
	}

	private async interactionAutocomplete(
		interaction: AutocompleteInteraction<CacheType>,
		client: BotClient
	) {
		if (interaction.commandName === CommandSlash.Play) {
			const focusedOption = interaction.options.getFocused(true);
			let choices: string[] | undefined;

			let keywordsCache = client
				.getDatabase()
				.userDataCache.userdata.get(interaction.user.id);
			if (!keywordsCache) {
				const data = await client.getDatabase().getUserData(interaction.user);
				if (data) {
					client
						.getDatabase()
						.userDataCache.userdata.set(interaction.user.id, data);
					keywordsCache = client
						.getDatabase()
						.userDataCache.userdata.get(interaction.user.id);
				}
			}

			if (focusedOption.name === 'song') {
				choices = keywordsCache?.keywords;
			}

			if (!choices) return;
			const filtered = choices.filter((choice) =>
				choice.toLowerCase().includes(focusedOption.value.toLowerCase())
			);
			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice }))
			);
		}
		else if (interaction.commandName === CommandSlash.Notify) {
			const textchannel = interaction.guild?.channels.cache.filter(
				(channel) => channel.type === ChannelType.GuildText
			);
			if (textchannel) {
				await interaction.respond(
					textchannel.map((choice) => ({
						name: choice.name,
						value: choice.id,
					}))
				);
			}
		}
	}

	initCommand(client: BotClient) {
		client.on(
			'interactionCreate',
			async (interaction: Interaction<CacheType>) => {
				if (interaction.isChatInputCommand()) {
					console.log(
						`[${interaction.user.username}] use command : ${interaction.commandName}`
					);
					await this.interactionChatInput(interaction, client);
				}
				else if (interaction.isButton()) {
					console.log(
						`[${interaction.user.username}] use button : ${interaction.customId}`
					);
					await this.interactionButton(interaction, client);
				}
				else if (interaction.isAutocomplete()) {
					await this.interactionAutocomplete(interaction, client);
				}
				else if (interaction.isContextMenuCommand()) {
					console.log(
						`[${interaction.user.username}] use constext : ${interaction.commandName}`
					);
					await this.interactionContext(interaction, client);
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
