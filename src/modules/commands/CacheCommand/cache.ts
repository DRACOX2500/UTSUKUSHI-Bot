/* eslint-disable no-shadow */
import { ChatInputCommandInteraction, InteractionResponse, SlashCommandBuilder, SlashCommandIntegerOption } from 'discord.js';
import { BotClient } from '@class/BotClient';

enum CacheType {
    Clear = 0,
}

export class CacheCommand {

	static readonly slash: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> = new SlashCommandBuilder()
		.setName('cache')
		.setDescription('Manage your user cache from UTSUKUSHI-BOT 📁!')
		.addIntegerOption((option : SlashCommandIntegerOption) =>
			option.setName('action')
				.setDescription('Type of bot activity')
				.addChoices(
					{ name: 'Clear', value: CacheType.Clear },
				)
				.setRequired(true));

	static readonly result = async (interaction: ChatInputCommandInteraction | null, client: BotClient): Promise<InteractionResponse | void> => {

		const code = (<number>interaction?.options.get('action')?.value) ?? -1;

		if (code === 0 && interaction) {
			client.getDatabase().userDataCache.clean(interaction.user);
			const clearBoolean = await client.getDatabase().resetUserData(interaction.user);
			if (clearBoolean)
				await interaction.reply('☑️ Cache Clear !');
			else
				await interaction.reply('❌ Cache Clear Failed !');
		}

	};

}