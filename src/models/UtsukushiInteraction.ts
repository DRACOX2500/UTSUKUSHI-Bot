import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import { BotClient } from 'src/BotClient';

export interface UtsukushiButton {

    readonly button: (disabled?: boolean) => ButtonBuilder;

    readonly getEffect: (interaction: ButtonInteraction, client: BotClient) => Promise<void>;
}