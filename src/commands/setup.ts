/* eslint-disable no-case-declarations */
import { bold, italic, EmbedBuilder, Interaction, ChatInputCommandInteraction, ButtonInteraction, InteractionResponse, CacheType, AutocompleteInteraction } from 'discord.js';
import { PingCommand } from './PingCommand/ping';
import { BigBurgerCommand } from './BigBurgerCommand/big-burger';
import { GitCommand } from './GitCommand/git';
import { SnoringCommand } from './SnoringCommand/snoring';
import { PlayCommand } from './PlayCommand/play';
import { ActivityCommand } from './ActivityCommand/activity';
import { CommandSlash } from './enum';
import { BotClient } from 'src/class/BotClient';
import { CacheCommand } from './CacheCommand/cache';

export class CommandSetup {

	private async interactionChatInput(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
		switch (interaction.commandName) {

		case CommandSlash.Ping :

			await interaction.reply(
				italic(
					bold(
						PingCommand.result(client)
					)
				)
			);
			break;
		case CommandSlash.BigBurger : {
			await interaction.reply('🍔 Burger loading...');
			const res = await BigBurgerCommand.result();
			await interaction.editReply(res);
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
		}
	}

	private async interactionButton(interaction: ButtonInteraction, client: BotClient): Promise<InteractionResponse<boolean> | undefined> {
		switch (interaction.customId) {

		case 'vdown':
			if (!client.connection.botPlayer?.resource || interaction.message.embeds[0].data.fields === undefined) return interaction.reply('❌ No Song available !');
			client.connection.botPlayer.volumeDown();

			interaction.message.embeds[0].data.fields[5].value = (client.connection.botPlayer.getVolume() * 100) + '%';

			const vDownEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
			interaction.message.edit({ embeds: [vDownEmbed] });

			await interaction.deferUpdate();
			break;
		case 'stop':

			client.connection.killConnection();
			await interaction.deferUpdate();
			break;
		case 'pause':
			if (!client.connection.botPlayer) return interaction.reply('❌ No Song available !');

			const playerStatus = client.connection.botPlayer.player.state.status;
			if (playerStatus === 'paused')
				client.connection.botPlayer.player.unpause();
			else if (playerStatus === 'playing')
				client.connection.botPlayer.player.pause();

			await interaction.deferUpdate();
			break;
		case 'skip':

			// TODO : skip command
			break;
		case 'vup':
			if (!client.connection.botPlayer?.resource || interaction.message.embeds[0].data.fields === undefined) return interaction.reply('❌ No Song available !');
			client.connection.botPlayer.volumeUp();

			interaction.message.embeds[0].data.fields[5].value = (client.connection.botPlayer.getVolume() * 100) + '%';

			const vUpEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
			interaction.message.edit({ embeds: [vUpEmbed] });

			await interaction.deferUpdate();
			break;
		}
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

		});
	}

	async interactionAutocomplete(interaction: AutocompleteInteraction<CacheType>, client: BotClient) {
		if (interaction.commandName === 'play') {
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
];