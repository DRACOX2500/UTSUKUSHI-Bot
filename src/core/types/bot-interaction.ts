import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import { BotClient } from '../bot-client';

export interface BotButton {
	readonly button: (disabled?: boolean) => ButtonBuilder;

	readonly result: (
		interaction: ButtonInteraction,
		client: BotClient
	) => Promise<void>;
}

export interface BotTrigger {
	readonly trigger: (client: BotClient) => Promise<void>;
}