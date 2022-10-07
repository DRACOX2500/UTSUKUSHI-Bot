import {
	Message,
	MessageContextMenuCommandInteraction,
	MessageManager,
} from 'discord.js';

class BotRemover {
	private deleteMessage = 0;

	async run(
		interaction: MessageContextMenuCommandInteraction,
		channelMessages: MessageManager,
		message: Message
	) {
		channelMessages.fetch({ after: message.id }).then(async (messages) => {
			const interactionId = await interaction.fetchReply();
			messages.delete(interactionId.id);
			messages.forEach((mes) => mes.delete());
			await message.delete();
			this.deleteMessage = messages.size + 1;
		});

		return this.deleteMessage;
	}
}

export class BotRemoverManager {
	readonly maxInstances: number;
	private removerMap: Map<string, BotRemover>;

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
     * @return `BotRemover | null`
     *
     * Return `null` if BotRemoverManager.maxInstances is Full
     * or if channelId is already in BotRemoverManager.removerMap
     */
	addRemover(channelId: string): BotRemover | null {
		if (this.isFull) return null;
		if (this.removerMap.get(channelId)) return null;

		const remover = new BotRemover();
		this.removerMap.set(channelId, remover);
		return remover;
	}
}
