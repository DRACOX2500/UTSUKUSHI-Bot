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
import { NotifyEvent } from './events/NotifyEvent';
import {
	UtsukushiAutocompleteSlashCommand,
	UtsukushiCommand,
	UtsukushiContextCommand,
	UtsukushiSlashCommand,
} from '@models/UtsukushiCommand';
import { cyan, lightMagenta, magenta } from 'ansicolor';
import { ReactAsBotSelect } from './selects/react-as-bot/react-as-bot.select';
import { UtsukushiButton } from '../../models/UtsukushiInteraction';
import { ModalSubmitInteraction } from 'discord.js';
import { ReplyAsBotModal } from './modals/reply-as-bot.modal';

export class CommandManager {
	commands!: Collection<string, UtsukushiSlashCommand>;
	contexts!: Collection<string, UtsukushiContextCommand<MessageContextMenuCommandInteraction|UserContextMenuCommandInteraction>>;

	private buttons!: Collection<string, UtsukushiButton>;

	constructor(private readonly client: BotClient) {
		this.commands = new Collection();
		this.contexts = new Collection();
		this.buttons = new Collection();
		this.loadCommands('commands', this.commands);
		this.loadCommands('contexts', this.contexts);

		this.loadButtons('buttons', this.buttons);
	}

	get allCollection(): Collection<string, UtsukushiCommand<any>> {
		return new Collection<string, UtsukushiCommand<any>>().concat(
			this.commands,
			this.contexts
		);
	}

	private loadCommands(
		folderTitle: string,
		collection: Collection<string, any>
	) {
		const filesList: string[][] = [];
		const commandsPath = path.join(__dirname, folderTitle);

		this.load(filesList, commandsPath, '.cmd.js');

		for (const file of filesList.flat()) {
			const command: UtsukushiCommand<any> = require(file).command;
			if (!command) continue;

			collection.set(command.command.name, command);
		}
	}

	private loadButtons(
		folderTitle: string,
		collection: Collection<string, UtsukushiButton>
	) {
		const filesList: string[][] = [];
		const buttonsPath = path.join(__dirname, folderTitle);

		this.load(filesList, buttonsPath, '.button.js');

		for (const file of filesList.flat()) {
			const content = require(file);

			const paramButton: UtsukushiButton = content.button;
			const paramButtons: UtsukushiButton[] = content.buttons;

			if (paramButton) {
				const customId: string = (<any>paramButton.button().data).custom_id;
				if (customId) collection.set(customId, paramButton);
			}
			else if (paramButtons) {
				paramButtons.forEach(button => {
					const customId: string = (<any>button.button().data).custom_id;
					if (customId) collection.set(customId, button);
				});
			}
		}
	}

	private load(filesList: string[][], absolutePath: string, suffix: string): void {
		try {
			fs.readdirSync(absolutePath).forEach((filefolder) => {
				const pathFile = path.join(absolutePath, filefolder);
				if (filefolder.endsWith(suffix)) filesList.push([pathFile]);
				else if (fs.statSync(pathFile).isDirectory()) {
					this.load(filesList, pathFile, suffix);
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

	private async interactionButton(
		interaction: ButtonInteraction,
		client: BotClient
	): Promise<void> {
		const button = this.buttons.get(interaction.customId);

		if (!button) return;

		try {
			await Promise.resolve(button.getEffect(interaction, client));
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}

	private async interactionSelect(interaction: SelectMenuInteraction<CacheType>, client: BotClient) {
		if (interaction.customId === 'rab-select') {
			ReactAsBotSelect.getEffect(interaction, client);
		}
	}

	private async interactionModal(interaction: ModalSubmitInteraction, client: BotClient) {
		if (interaction.customId === 'rpab-modal') {
			ReplyAsBotModal.getEffect(interaction);
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
				else if (interaction.isModalSubmit()) {
					console.log(
						`[${cyan(interaction.user.username)} - #${lightMagenta(interaction.user.id)}] use modal : ${magenta(interaction.customId)}`
					);
					await this.interactionModal(interaction, client);
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
