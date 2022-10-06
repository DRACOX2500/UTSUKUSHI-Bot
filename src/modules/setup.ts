/* eslint-disable no-case-declarations */
import { Interaction, ChatInputCommandInteraction, ButtonInteraction, CacheType, AutocompleteInteraction, ChannelType, ContextMenuCommandInteraction } from 'discord.js';
import { PingCommand } from './commands/PingCommand/ping';
import { BigBurgerCommand } from './commands/BigBurgerCommand/big-burger';
import { GitCommand } from './commands/GitCommand/git';
import { SnoringCommand } from './commands/SnoringCommand/snoring';
import { PlayCommand } from './commands/PlayCommand/play';
import { ActivityCommand } from './commands/ActivityCommand/activity';
import { CommandButton, CommandSlash } from './enum';
import { BotClient } from '@class/BotClient';
import { CacheCommand } from './commands/CacheCommand/cache';
import { NotifyCommand } from './commands/NotifyCommand/notify';
import { FuelCommand } from './commands/FuelCommand/fuel';
import { NotifyEvent } from './events/NotifyEvent';
import { DeleteContext } from './contexts/DeleteContext';
import { ButtonPause } from './button/play/ButtonPause';
import { ButtonVolume } from './button/play/ButtonVolumeDown';

export class CommandSetup {

	private async interactionChatInput(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
		switch (interaction.commandName) {

		case CommandSlash.Ping :

			PingCommand.result(interaction, client);
			break;
		case CommandSlash.BigBurger : {

			await BigBurgerCommand.result(interaction);
			break;
		}
		case CommandSlash.Git :

			await interaction.reply(GitCommand.result());
			break;
		case CommandSlash.Snoring :

			await SnoringCommand.result(interaction, client);
			break;
		case CommandSlash.Play :

			await PlayCommand.result(interaction, client);
			break;
		case CommandSlash.Activity :

			await interaction.reply(ActivityCommand.result(interaction, client));
			break;
		case CommandSlash.Cache :

			await CacheCommand.result(interaction, client);
			break;
		case CommandSlash.Notify :

			NotifyCommand.result(interaction, client);
			break;
		case CommandSlash.Fuel :

			FuelCommand.result(interaction);
			break;
		}
	}

	private async interactionButton(interaction: ButtonInteraction, client: BotClient): Promise<void> {
		switch (interaction.customId) {

		case CommandButton.VolumeDown :

			await new ButtonVolume(interaction, client).getDownEffect();
			break;
		case CommandButton.Stop :

			client.connection.killConnection();
			await interaction.deferUpdate();
			break;
		case CommandButton.Pause :

			await new ButtonPause(interaction, client).getEffect();
			break;
		case CommandButton.Skip :

			// TODO : skip command
			break;
		case CommandButton.VolumeUp :

			await new ButtonVolume(interaction, client).getUpEffect();
			break;
		}
	}

	private async interactionAutocomplete(interaction: AutocompleteInteraction<CacheType>, client: BotClient) {
		if (interaction.commandName === CommandSlash.Play) {
			const focusedOption = interaction.options.getFocused(true);
			let choices: string[] | undefined;

			let keywordsCache = client.getDatabase().userDataCache.userdata.get(interaction.user.id);
			if (!keywordsCache) {
				const data = await client.getDatabase().getUserData(interaction.user);
				if (data) {
					client.getDatabase().userDataCache.userdata.set(interaction.user.id, data);
					keywordsCache = client.getDatabase().userDataCache.userdata.get(interaction.user.id);
				}
			}

			if (focusedOption.name === 'song') {
				choices = keywordsCache?.keywords;
			}

			if (!choices) return;
			const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()));
			await interaction.respond(
				filtered.map(choice => ({ name: choice, value: choice })),
			);
		}
		else if (interaction.commandName === CommandSlash.Notify) {
			const textchannel = interaction.guild?.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
			if (textchannel) {
				await interaction.respond(
					textchannel.map(choice => ({ name: choice.name, value: choice.id })),
				);
			}
		}
	}

	private async interactionContext(interaction: ContextMenuCommandInteraction, client: BotClient): Promise<void> {

		if (interaction.isMessageContextMenuCommand())
			DeleteContext.result(interaction, client);
	}

	initCommand(client: BotClient) {
		client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {

			if (interaction.isChatInputCommand()) {
				console.log('[' + interaction.user.username + '] use commands : ' + interaction.commandName);
				await this.interactionChatInput(interaction, client);
			}
			else if (interaction.isButton()) {
				console.log('[' + interaction.user.username + '] use button : ' + interaction.customId);
				await this.interactionButton(interaction, client);
			}
			else if (interaction.isAutocomplete()) {
				await this.interactionAutocomplete(interaction, client);
			}
			else if (interaction.isContextMenuCommand()) {
				console.log('[' + interaction.user.username + '] use constext : ' + interaction.commandName);
				await this.interactionContext(interaction, client);
			}

		});
	}

	initBotEvents(client: BotClient) {
		client.on('voiceStateUpdate', async (oldState, newState) => {
			if (oldState.channelId === newState.channelId) {
				// 'a user has not moved!'
			}
			if (oldState.channelId != null && newState.channelId != null && newState.channelId != oldState.channelId) {
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

export const COMMANDS = [
	PingCommand.slash,
	BigBurgerCommand.slash,
	GitCommand.slash,
	SnoringCommand.slash,
	PlayCommand.slash,
	ActivityCommand.slash,
	CacheCommand.slash,
	NotifyCommand.slash,
	FuelCommand.slash,
	DeleteContext.context,
];