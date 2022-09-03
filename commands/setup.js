const { bold, italic, EmbedBuilder } = require('discord.js');

const ping = require('./ping.js');
const burger = require('./big-burger.js');
const git = require('./git.js');
const snoring = require('./snoring.js');
const play = require('./play.js');
const activity = require('./activity.js');

async function interactionChatInput(interaction, client) {
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
}

async function interactionButton(interaction, client) {
	switch (interaction.customId) {

	case 'vdown':
		client.volumeDown();

		interaction.message.embeds[0].data.fields[5].value = (client.resource.volume.volume * 100) + '%';

		// eslint-disable-next-line no-case-declarations
		const vDownEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
		interaction.message.edit({ embeds: [vDownEmbed] });

		await interaction.deferUpdate();
		break;
	case 'stop':

		client.killConnection();
		await interaction.deferUpdate();
		break;
	case 'pause':
		if (!client.player) return interaction.reply('❌ No Song available !');

		if (client.isPausePlayer) {
			client.player.unpause();
			await interaction.deferUpdate();
		}
		else {
			client.player.pause();
			await interaction.deferUpdate();
		}

		client.isPausePlayer = !client.isPausePlayer;
		break;
	case 'skip':

		// TODO : skip command
		break;
	case 'vup':

		client.volumeUp();

		interaction.message.embeds[0].data.fields[5].value = (client.resource.volume.volume * 100) + '%';

		// eslint-disable-next-line no-case-declarations
		const vUpEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
		interaction.message.edit({ embeds: [vUpEmbed] });

		await interaction.deferUpdate();
		break;
	}
}

module.exports = (client) => {

	client.on('interactionCreate', async interaction => {

		if (interaction.isChatInputCommand()) {
			console.log('[' + interaction.user.username + '] use commands : ' + interaction.commandName);
			await interactionChatInput(interaction, client);
		}
		else if (interaction.isButton()) {
			console.log('[' + interaction.user.username + '] use button : ' + interaction.customId);
			await interactionButton(interaction, client);
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