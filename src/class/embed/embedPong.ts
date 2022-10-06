/* eslint-disable no-shadow */
import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { getRandomInt } from '@utils/getRandomInt';
import { BotClient } from '@class/BotClient';

enum Color {
    Green = 0x41DF19,
    Yellow = 0xDFD019,
    Red = 0xDF1919,
}

export class EmbedPong {

	private timestamp: number;
	private wsPing: number;

	constructor(message: Message | null, interaction: ChatInputCommandInteraction | null, client: BotClient) {

		this.timestamp = this.getPongLatency(message?.createdTimestamp ?? 0, interaction?.createdTimestamp ?? 0);
		this.wsPing = this.getWsPing(client);
	}

	private getWsPing(cli: BotClient): number {
		return Math.round(cli.ws.ping);
	}

	private getPongLatency(messageTimestamp: number, interactionTimestamp: number): number {
		return Math.round(messageTimestamp - interactionTimestamp);
	}

	private get title(): string {
		if (getRandomInt(5) === 1)
			return '🏓🔥 ***SMAAAAAAAAAAAAAAAAASH !!!!!***';
		else
			return '🏓 ***Pong !***';
	}

	private get color(): number {
		if (this.timestamp <= 500)
			return Color.Green;
		else if (this.timestamp > 500 && this.timestamp <= 750)
			return Color.Yellow;
		else
			return Color.Red;
	}

	getEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(this.title)
			.setColor(this.color)
			.setDescription(
				`⌛ **Time**: ${this.timestamp}ms\n` +
                `⏱️ **WS**: ${this.wsPing}ms`
			);
	}
}