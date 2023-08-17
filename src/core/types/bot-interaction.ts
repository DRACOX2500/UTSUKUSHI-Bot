import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import { BotClient } from '../bot-client';

export interface CommandManagerConfig {
    buttonsPath: string[];
    commandsPath: string[];
    triggersPath: string[];
    contextPath: string[];
}

export interface BotButton<T extends BotClient =  BotClient> {
	button: ButtonBuilder;

	result(
		interaction: ButtonInteraction,
		client: T
	): Promise<void>;
}

export interface BotTrigger<T extends BotClient = BotClient> {
	readonly trigger: (client: T) => Promise<void>;
}