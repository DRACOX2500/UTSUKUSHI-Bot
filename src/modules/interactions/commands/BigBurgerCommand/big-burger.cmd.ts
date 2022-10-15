/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BurgerAPI } from 'root/src/api/burger/burger.api';
import { UtsukushiCommandOptions, UtsukushiSlashCommand } from '@models/UtsukushiCommand';
import { BotClient } from 'src/BotClient';

/**
 * @SlashCommand `big-burger`
 *  - `big-burger` : Get random burger picture !
 */
export class BigBurgerCommand implements UtsukushiSlashCommand {

	readonly command = new SlashCommandBuilder()
		.setName('big-burger')
		.setDescription('Random Burger 🍔!')
		.setDMPermission(true);

	readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient, options?: UtsukushiCommandOptions): Promise<void> => {

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