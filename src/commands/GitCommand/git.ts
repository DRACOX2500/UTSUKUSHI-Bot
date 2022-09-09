import { SlashCommandBuilder } from 'discord.js';

export class GitCommand {

	static readonly slash: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('git')
		.setDescription('Get GitHub Repository 🛠️!');

	static readonly result = () => {
		return 'https://github.com/DRACOX2500/Discord-Bot';
	};
}