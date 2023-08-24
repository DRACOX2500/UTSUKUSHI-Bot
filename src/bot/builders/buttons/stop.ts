import { ButtonStyle } from 'discord.js';
import { BotButtonBuilder } from '../../../core/bot-command';

export class StopButton extends BotButtonBuilder {
	constructor(id: string, disable: boolean = false) {
		super(id, disable);

		this
			.setEmoji('<:stop:937333534186680321>')
			.setStyle(ButtonStyle.Danger);
	}
}