import {
	Message,
	MessageContextMenuCommandInteraction,
	MessageManager,
} from 'discord.js';
import { logger } from './logger/logger';

class BotMessageRemover {
	private deleteMessage = 0;

	async run(
		interaction: MessageContextMenuCommandInteraction,
		channelMessages: MessageManager,
		message: Message
	) {
		await channelMessages
			.fetch({ after: message.id })
			.then(async (messages) => {
				const interactionId = await interaction.fetchReply();
				messages.delete(interactionId.id);
				messages.forEach((mes) => {
					mes.delete().catch((err: Error) => logger.error({}, err.message));
				});
				await message.delete();
				this.deleteMessage = messages.size + 1;
			});

		return this.deleteMessage;
	}
}

export class BotMessageRemoverManager {
	readonly maxInstances: number;
	private removerMap: Map<string, BotMessageRemover>;

	constructor(maxInstances: number) {
		this.maxInstances = maxInstances;
		this.removerMap = new Map();
	}

	get currentInstancesRunning(): number {
		return this.removerMap.size;
	}

	get isFull(): boolean {
		return this.currentInstancesRunning >= this.maxInstances;
	}

	/**
	 * @param channelId
	 * @return `BotMessageRemover | null`
	 *
	 * Return `null` if BotMessageRemoverManager.maxInstances is Full
	 * or if channelId is already in BotMessageRemoverManager.removerMap
	 */
	addRemover(channelId: string): BotMessageRemover | null {
		if (this.isFull) return null;
		if (this.removerMap.get(channelId)) return null;

		const remover = new BotMessageRemover();
		this.removerMap.set(channelId, remover);
		return remover;
	}

	deleteRemover(channelId: string): void {
		this.removerMap.delete(channelId);
	}
}
