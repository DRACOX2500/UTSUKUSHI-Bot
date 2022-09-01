const { SlashCommandBuilder } = require('discord.js');

const git = new SlashCommandBuilder()
	.setName('git')
	.setDescription('Get GitHub Repository 🛠️!');

exports.GIT_COMMAND = git;

exports.result = () => {
	return 'https://github.com/DRACOX2500/Discord-Bot';
};