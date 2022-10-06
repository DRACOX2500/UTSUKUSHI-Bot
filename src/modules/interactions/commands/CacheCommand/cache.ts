/* eslint-disable no-shadow */
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiSlashCommand } from '@models/UtsukushiSlashCommand';

enum CacheType {
    Clear = 0,
}

export class CacheCommand implements UtsukushiSlashCommand {

	readonly slash: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> = new SlashCommandBuilder()
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
				await interaction.reply('☑️ Cache Clear !');
			else
				await interaction.reply('❌ Cache Clear Failed !');
		}

	};

}

export const command = new CacheCommand();