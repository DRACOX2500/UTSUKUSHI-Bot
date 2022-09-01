/* eslint-disable curly */
const { SlashCommandBuilder } = require('discord.js');

const ping = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong 🏓!');

exports.PING_COMMAND = ping;

exports.result = (client) => {
	if (!client) return '‼️🤖 No Client found !';

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function getWsPing(client) {
		return Math.round(client.ws.ping);
	}

	if (getRandomInt(5) == 1)
		return `🏓🔥 SMAAAAAAAAAAAAAAAAASH! (${getWsPing(client)}ms)`;
	else
		return `🏓 Pong! (${getWsPing(client)}ms)`;
};