import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UtsukushiSlashCommand } from '@models/UtsukushiSlashCommand';

export class GitCommand implements UtsukushiSlashCommand {

	readonly slash: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('git')
		.setDescription('Get GitHub Repository 🛠️!');

	readonly result = async (interaction: ChatInputCommandInteraction): Promise<void> => {
		interaction.reply({ content: 'https://github.com/DRACOX2500/Discord-Bot', ephemeral: true });
	};
}

export const command = new GitCommand();