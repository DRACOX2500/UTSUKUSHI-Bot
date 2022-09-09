/* eslint-disable no-shadow */
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption } from 'discord.js';
import { BotClient } from 'src/class/BotClient';

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

	static readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient) => {

		const code = <number>interaction.options.get('action')?.value;

		if (code === 0) {
			client.getDatabase().userDataCache.clean(interaction.user);
			const clearBoolean = await client.getDatabase().resetUserData(interaction.user);
			if (clearBoolean)
				await interaction.reply('☑️ Cache Clear !');
			else
				await interaction.reply('❌ Cache Clear Failed !');
		}

	};

}