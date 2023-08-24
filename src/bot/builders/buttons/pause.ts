import { ButtonStyle } from 'discord.js';
import { BotButtonBuilder } from '../../../core/bot-command';

export class PauseButton extends BotButtonBuilder {
	constructor(id: string, disable: boolean = false) {
		super(id, disable);

		this
			.setEmoji('<:p_:937332417738473503>')
			.setStyle(ButtonStyle.Success);
	}
}