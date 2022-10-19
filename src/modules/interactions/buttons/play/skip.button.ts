import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import { UtsukushiButton } from '@models/utsukushi-interaction.model';

export class SkipButton implements UtsukushiButton {
	readonly button = (disabled = false): ButtonBuilder => {
		return new ButtonBuilder()
			.setCustomId('skip')
			.setEmoji('<:skip:937332450953146432>')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled);
	};

	readonly getEffect = async (
		interaction: ButtonInteraction
	): Promise<void> => {
		// TODO : skip command
		await interaction.deferUpdate();
	};
}

export const button = new SkipButton();
