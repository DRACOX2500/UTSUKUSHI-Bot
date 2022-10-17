import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';

export interface UtsukushiButton {
	readonly button: (disabled?: boolean) => ButtonBuilder;

	readonly getEffect: (
		interaction: ButtonInteraction,
		client: UtsukushiClient
	) => Promise<void>;
}

export interface UtsukushiEvent {
	readonly event: (client: UtsukushiClient) => Promise<void>;
}