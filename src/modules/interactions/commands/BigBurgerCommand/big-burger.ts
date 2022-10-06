/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BurgerAPI } from '@api/burger/BurgerAPI';
import { UtsukushiSlashCommand, UtsukushiSlashCommandOptions } from '@models/UtsukushiSlashCommand';
import { BotClient } from 'src/BotClient';

export class BigBurgerCommand implements UtsukushiSlashCommand {

	readonly slash = new SlashCommandBuilder()
		.setName('big-burger')
		.setDescription('Random Burger 🍔!');

	readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient, options?: UtsukushiSlashCommandOptions): Promise<void> => {

		await interaction.reply('🍔 Burger loading...');

		const api = new BurgerAPI();
		const response = await api.getReponse(options?.test_error ?? false);

		if (typeof response === 'string')
			await interaction.editReply(response);
		else
			await interaction.editReply(response.image);
	};
}

export const command = new BigBurgerCommand();