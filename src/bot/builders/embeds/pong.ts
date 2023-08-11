import { ChatInputCommandInteraction, EmbedBuilder, Message } from "discord.js";
import { UtsukushiBotClient } from "../../client";
import { Getter } from "@/core/utils/getter";
import { PONG_COLOR, PONG_SMASH_CHANCE } from "@/constants";

export class PongEmbedBuilder extends EmbedBuilder {
    private timestamp: number;
	private wsPing: number;

	constructor(
		message: Message | null,
		interaction: ChatInputCommandInteraction | null,
		private client: UtsukushiBotClient
	) {
		super();
		this.timestamp = this.getPongLatency(
			message?.createdTimestamp ?? 0,
			interaction?.createdTimestamp ?? 0
		);
		this.wsPing = this.getWsPing();

		this.setTitle(this.title);
		this.setColor(this.color);
		this.setDescription(
				`⌛ **Time**: ${this.timestamp}ms\n` + `⏱️ **WS**: ${this.wsPing}ms`
			);
	}

	private getWsPing(): number {
		return Math.round(this.client.ws.ping);
	}

	private getPongLatency(
		messageTimestamp: number,
		interactionTimestamp: number
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