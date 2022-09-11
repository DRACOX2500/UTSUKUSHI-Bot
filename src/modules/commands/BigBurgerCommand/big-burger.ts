/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BurgerAPI } from '../../../api/burger/BurgerAPI';

export class BigBurgerCommand {

	static readonly slash = new SlashCommandBuilder()
		.setName('big-burger')
		.setDescription('Random Burger 🍔!');

	static readonly result = async (interaction: ChatInputCommandInteraction, test_error = false): Promise<void> => {

		await interaction.reply('🍔 Burger loading...');

		const api = new BurgerAPI();
		const response = await api.getReponse(test_error);

		if (typeof response === 'string')
			await interaction.editReply(response);
		else
			await interaction.editReply(response.image);
	};
}