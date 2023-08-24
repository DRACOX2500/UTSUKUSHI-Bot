import { ButtonStyle } from 'discord.js';
import { BotButtonBuilder } from '../../../core/bot-command';

export class VolumeUpButton extends BotButtonBuilder {
	constructor(id: string, disable: boolean = false) {
		super(id, disable);

		this
			.setEmoji('<:volp:937332469798162462>')
			.setStyle(ButtonStyle.Secondary);
	}
}