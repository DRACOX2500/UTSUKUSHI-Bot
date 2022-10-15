import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiButton } from '@models/UtsukushiInteraction';

export class SkipButton implements UtsukushiButton {

	readonly button = (disabled = false): ButtonBuilder => {
		return new ButtonBuilder()
			.setCustomId('skip')
			.setEmoji('<:skip:937332450953146432>')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled);
	};

	readonly getEffect = async (interaction: ButtonInteraction, client: BotClient): Promise<void> => {
		// TODO : skip command
		await interaction.deferUpdate();
	};
}

export const button = new SkipButton();