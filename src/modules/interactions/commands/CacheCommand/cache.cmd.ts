/* eslint-disable no-shadow */
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiCommand } from '@models/UtsukushiCommand';

enum CacheType {
    Clear = 0,
}

export class CacheCommand implements UtsukushiCommand<ChatInputCommandInteraction> {

	readonly command: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> = new SlashCommandBuilder()
		.setName('cache')
		.setDescription('Manage your user cache from UTSUKUSHI-BOT 📁!')
		.addIntegerOption((option : SlashCommandIntegerOption) =>
			option.setName('action')
				.setDescription('Type of bot activity')
				.addChoices(
					{ name: 'Clear', value: CacheType.Clear },
				)
				.setRequired(true));

	readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> => {

		const code = (<number>interaction?.options.get('action')?.value) ?? -1;

		if (code === 0 && interaction) {
			client.getDatabase().userDataCache.clean(interaction.user);
			const clearBoolean = await client.getDatabase().resetUserData(interaction.user);
			if (clearBoolean)
				await interaction.reply({ content: '☑️ Cache Clear !', ephemeral: true });
			else
				await interaction.reply({ content: '❌ Cache Clear Failed !', ephemeral: true });
		}

	};

}

export const command = new CacheCommand();