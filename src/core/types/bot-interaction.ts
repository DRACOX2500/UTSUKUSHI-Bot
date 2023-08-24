import { type ButtonBuilder, type ButtonInteraction } from 'discord.js';
import { type BotClient } from '../bot-client';

export interface CommandManagerConfig {
    buttonsPath: string[];
    commandsPath: string[];
    triggersPath: string[];
    contextPath: string[];
	modalsPath: string[];
	selectsPath: string[];
}

export interface BotButton<T extends BotClient = BotClient> {
	button: ButtonBuilder;

	result: (
		interaction: ButtonInteraction,
		client: T
	) => Promise<void>;
}

export interface BotTrigger<T extends BotClient = BotClient> {
	trigger: (client: T) => Promise<void>;
}

export interface BotChoice {
	name: string;
	value: string;
}