/* eslint-disable no-case-declarations */
import { bold, italic, EmbedBuilder, Interaction, ChatInputCommandInteraction, ButtonInteraction, InteractionResponse, CacheType } from 'discord.js';
import { PingCommand } from './PingCommand/ping';
import { BigBurgerCommand } from './BigBurgerCommand/big-burger';
import { GitCommand } from './GitCommand/git';
import { SnoringCommand } from './SnoringCommand/snoring';
import { PlayCommand } from './PlayCommand/play';
import { ActivityCommand } from './ActivityCommand/activity';
import { CommandSlash } from './enum';
import { BotClient } from 'src/class/BotClient';

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
];