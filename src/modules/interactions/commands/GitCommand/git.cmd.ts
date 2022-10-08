import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UtsukushiSlashCommand } from '@models/UtsukushiCommand';

/**
 * @SlashCommand `git`
 *  - `git` : get Github repository
 */
export class GitCommand implements UtsukushiSlashCommand {

	readonly command: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('git')
		.setDescription('Get GitHub Repository 🛠️!')
		.setDMPermission(true);

	readonly result = async (interaction: ChatInputCommandInteraction): Promise<void> => {
		interaction.reply({ content: 'https://github.com/DRACOX2500/Discord-Bot', ephemeral: true });
	};
}

export const command = new GitCommand();