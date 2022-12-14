/* eslint-disable no-shadow */
import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { Getter } from '@utils/getter';
import { UtsukushiClient } from 'src/utsukushi-client';

enum Color {
	Green = 0x41df19,
	Yellow = 0xdfd019,
	Red = 0xdf1919,
}

export class PongEmbed {
	private timestamp: number;
	private wsPing: number;

	constructor(
		message: Message | null,
		interaction: ChatInputCommandInteraction | null,
		client: UtsukushiClient
	) {
		this.timestamp = this.getPongLatency(
			message?.createdTimestamp ?? 0,
			interaction?.createdTimestamp ?? 0
		);
		this.wsPing = this.getWsPing(client);
	}

	private getWsPing(cli: UtsukushiClient): number {
		return Math.round(cli.ws.ping);
	}

	private getPongLatency(
		messageTimestamp: number,
		interactionTimestamp: number
	): number {
		return Math.round(messageTimestamp - interactionTimestamp);
	}

	private get title(): string {
		if (Getter.randomNumber(5) === 1) return '🏓🔥 ***SMAAAAAAAAAAAAAAAAASH !!!!!***';
		else return '🏓 ***Pong !***';
	}

	private get color(): number {
		if (this.timestamp <= 500) return Color.Green;
		else if (this.timestamp > 500 && this.timestamp <= 750) return Color.Yellow;
		else return Color.Red;
	}

	getEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(this.title)
			.setColor(this.color)
			.setDescription(
				`⌛ **Time**: ${this.timestamp}ms\n` + `⏱️ **WS**: ${this.wsPing}ms`
			);
	}
}
