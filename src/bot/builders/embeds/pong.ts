import { EmbedBuilder, type Message, type ChatInputCommandInteraction } from 'discord.js';
import { PONG_SMASH_CHANCE, PONG_COLOR } from '../../../constants';
import { type BotClient } from '../../../core/bot-client';
import { Getter } from '../../../core/utils/getter';


export class PongEmbedBuilder extends EmbedBuilder {
	private readonly timestamp: number;
	private readonly wsPing: number;

	constructor(
		message: Message | null,
		interaction: ChatInputCommandInteraction | null,
		private readonly client: BotClient,
	) {
		super();
		this.timestamp = this.getPongLatency(
			message?.createdTimestamp ?? 0,
			interaction?.createdTimestamp ?? 0,
		);
		this.wsPing = this.getWsPing();

		this.setTitle(this.title);
		this.setColor(this.color);
		this.setDescription(
			`⌛ **Time**: ${this.timestamp}ms\n` + `⏱️ **WS**: ${this.wsPing}ms`,
		);
	}

	private getWsPing(): number {
		return Math.round(this.client.ws.ping);
	}

	private getPongLatency(
		messageTimestamp: number,
		interactionTimestamp: number,
	): number {
		return Math.round(messageTimestamp - interactionTimestamp);
	}

	private get title(): string {
		if (Getter.randomNumber(PONG_SMASH_CHANCE) === 1)
			return '🏓🔥 ***SMAAAAAAAAAAAAAAAAASH !!!!!***';
		else return '🏓 ***Pong !***';
	}

	private get color(): number {
		if (this.timestamp <= 500) return PONG_COLOR.GREEN;
		else if (this.timestamp > 500 && this.timestamp <= 750) return PONG_COLOR.YELLOW;
		else return PONG_COLOR.RED;
	}
}