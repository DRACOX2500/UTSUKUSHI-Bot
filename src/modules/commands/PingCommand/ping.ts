import { Client, SlashCommandBuilder } from 'discord.js';
import { getRandomInt } from '../../../utils/getRandomInt';

export class PingCommand {

	static readonly slash: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong 🏓!');

	static readonly result = (client: Client | null): string => {
		if (!client) return '‼️🤖 No Client found !';

		function getWsPing(cli: Client) {
			return Math.round(cli.ws.ping);
		}

		if (getRandomInt(5) == 1)
			return `🏓🔥 SMAAAAAAAAAAAAAAAAASH! (${getWsPing(client)}ms)`;
		else
			return `🏓 Pong! (${getWsPing(client)}ms)`;
	};

}