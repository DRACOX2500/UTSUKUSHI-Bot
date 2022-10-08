import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UtsukushiCommand } from '@models/UtsukushiCommand';

export class GitCommand implements UtsukushiCommand<ChatInputCommandInteraction> {

	readonly command: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('git')
		.setDescription('Get GitHub Repository 🛠️!');

	readonly result = async (interaction: ChatInputCommandInteraction): Promise<void> => {
		interaction.reply({ content: 'https://github.com/DRACOX2500/Discord-Bot', ephemeral: true });
	};
}

export const command = new GitCommand();