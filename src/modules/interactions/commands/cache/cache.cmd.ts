/* eslint-disable no-shadow */
import {
	ChatInputCommandInteraction,
	codeBlock,
	SlashCommandBuilder,
	SlashCommandIntegerOption,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiSlashCommand } from 'root/src/models/utsukushi-command.model';

/**
 * - `Clear`| clear all data from your user cache
 * - `Show`	| send user data cache to user
 */
enum CacheType {
	Clear = 0,
	Show = 1,
}

/**
 * @SlashCommand `cache`
 *  - `cache [action]` : Manage user cache from database !
 */
export class CacheCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('cache')
		.setDescription('Manage your user cache from UTSUKUSHI-BOT 📁!')
		.setDMPermission(true)
		.addIntegerOption((option: SlashCommandIntegerOption) =>
			option
				.setName('action')
				.setDescription('What action to perform ?')
				.addChoices(
					{
						name: 'Clear | clear all data from your user cache',
						value: CacheType.Clear,
					},
					{
						name: 'Show | Utsukushi send you in DM, your cache data',
						value: CacheType.Show,
					}
				)
				.setRequired(true)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {
		const code = interaction?.options.getInteger('action') ?? -1;

		switch (code) {
		case CacheType.Clear: {
			await interaction.deferReply({ ephemeral: true });
			client.getDatabase().dataCache.clean(interaction.user);
			const clearBoolean = await client
				.getDatabase()
				.resetUserData(interaction.user);
			if (clearBoolean)
				await interaction.editReply({
					content: '✅ Cache Clear !',
				});
			else
				await interaction.editReply({
					content: '❌ Cache Clear Failed !',
				});
			break;
		}
		case CacheType.Show: {
			await interaction.deferReply({ ephemeral: true });
			const data = await client.getDatabase().getUserData(interaction.user);
			if (data) {
				await interaction.user.send(
					codeBlock('json', JSON.stringify(data, null, '\t'))
				);
				await interaction.editReply({
					content: '✅ Data sent',
				});
			}
			else
				await interaction.editReply({
					content:
							'❌ Cache Show Failed ! Maybe you don\'t have data in my database ?',
				});
			break;
		}
		default:
			await interaction.reply({
				content: '❌ Command Failed !',
				ephemeral: true,
			});
			break;
		}
	};
}

export const command = new CacheCommand();
