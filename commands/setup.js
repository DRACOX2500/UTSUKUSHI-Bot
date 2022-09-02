const { bold, italic } = require('discord.js');

const ping = require('../commands/ping.js');
const burger = require('../commands/big-burger.js');
const git = require('../commands/git.js');
const snoring = require('../commands/snoring.js');
const play = require('../commands/play.js');
const activity = require('../commands/activity.js');

module.exports = (client) => {

	client.on('interactionCreate', async interaction => {

		if (!interaction.isChatInputCommand()) return;
		console.log('[' + interaction.user.username + '] use commands : ' + interaction.commandName);

		switch (interaction.commandName) {

		case 'ping':

			await interaction.reply(italic(bold(ping.result(client))));
			break;
		case 'big-burger': {
			const res = await burger.result();
			await interaction.reply(res);
			break;
		}
		case 'git':

			await interaction.reply(git.result());
			break;
		case 'snoring':

			await snoring.result(interaction, client);
			break;
		case 'play':

			await play.result(interaction, client);
			break;
		case 'activity':

			await interaction.reply(activity.result(interaction, client));
			break;
		}
	});

	// Add all commands here !
	return [
		ping.PING_COMMAND,
		burger.BURGER_COMMAND,
		git.GIT_COMMAND,
		snoring.SNORING_COMMAND,
		play.PLAY_MUSIC_COMMAND,
		activity.ACTIVITY_COMMAND,
	];

};