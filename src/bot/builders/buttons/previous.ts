import { BotButtonBuilder } from '../../../core/bot-command';
import { ButtonStyle } from 'discord.js';

export class PreviousButton extends BotButtonBuilder {
	constructor(id: string, disable: boolean = false) {
		super(id, disable);

		this
			.setEmoji('⏪')
			.setStyle(ButtonStyle.Primary);
	}
}