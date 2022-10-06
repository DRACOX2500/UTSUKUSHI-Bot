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
import { DeleteContext } from './contexts/DeleteContext';
import { ButtonPause } from './button/play/ButtonPause';
import { ButtonVolume } from './button/play/ButtonVolumeDown';
import { UtsukushiSlashCommand } from 'src/models/UtsukushiSlashCommand';

export class CommandManager {
	commands!: Collection<string, UtsukushiSlashCommand>;

	constructor(private readonly client: BotClient) {
		this.commands = new Collection();
		this.loadSlashCommand();
	}

	private loadSlashCommand() {
		const commandFiles: string[][] = [];
		const commandsPath = path.join(__dirname, 'commands');
		const commandFolders = fs.readdirSync(commandsPath);
		commandFolders.forEach(
			(folder) => commandFiles.push(fs.readdirSync(`${commandsPath}\\${folder}`)
				.map(file => `${commandsPath}\\${folder}\\${file}`)
				.filter(file => file.endsWith('.js')))
		);

		for (const file of commandFiles.flat()) {
			const command: UtsukushiSlashCommand = require(file).command;

			this.commands.set(command.slash.name, command);
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
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

	// private async interactionChatInput(
	// 	interaction: ChatInputCommandInteraction,
	// 	client: BotClient
	// ): Promise<void> {
	// 	switch (interaction.commandName) {
	// 	case CommandSlash.Ping:
	// 		PingCommand.result(interaction, client);
	// 		break;
	// 	case CommandSlash.BigBurger: {
	// 		await BigBurgerCommand.result(interaction);
	// 		break;
	// 	}
	// 	case CommandSlash.Git:
	// 		await interaction.reply(GitCommand.result());
	// 		break;
	// 	case CommandSlash.Snoring:
	// 		await SnoringCommand.result(interaction, client);
	// 		break;
	// 	case CommandSlash.Play:
	// 		await PlayCommand.result(interaction, client);
	// 		break;
	// 	case CommandSlash.Activity:
	// 		await ActivityCommand.result(interaction, client);
	// 		break;
	// 	case CommandSlash.Cache:
	// 		await CacheCommand.result(interaction, client);
	// 		break;
	// 	case CommandSlash.Notify:
	// 		NotifyCommand.result(interaction, client);
	// 		break;
	// 	case CommandSlash.Fuel:
	// 		FuelCommand.result(interaction);
	// 		break;
	// 	}
	// }

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

	private async interactionContext(
		interaction: ContextMenuCommandInteraction,
		client: BotClient
	): Promise<void> {
		if (interaction.isMessageContextMenuCommand())
			DeleteContext.result(interaction, client);
	}

	initCommand(client: BotClient) {
		client.on(
			'interactionCreate',
			async (interaction: Interaction<CacheType>) => {
				if (interaction.isChatInputCommand()) {
					console.log(
						'[' +
							interaction.user.username +
							'] use commands : ' +
							interaction.commandName
					);
					await this.interactionChatInput(interaction, client);
				}
				else if (interaction.isButton()) {
					console.log(
						'[' +
							interaction.user.username +
							'] use button : ' +
							interaction.customId
					);
					await this.interactionButton(interaction, client);
				}
				else if (interaction.isAutocomplete()) {
					await this.interactionAutocomplete(interaction, client);
				}
				else if (interaction.isContextMenuCommand()) {
					console.log(
						'[' +
							interaction.user.username +
							'] use constext : ' +
							interaction.commandName
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
