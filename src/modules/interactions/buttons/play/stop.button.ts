import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiButton } from '@models/UtsukushiInteraction';

export class StopButton implements UtsukushiButton {
	readonly button = (disabled = false): ButtonBuilder => {
		return new ButtonBuilder()
			.setCustomId('play-stop')
			.setEmoji('<:stop:937333534186680321>')
			.setStyle(ButtonStyle.Danger)
			.setDisabled(disabled);
	};

	readonly getEffect = async (
		interaction: ButtonInteraction,
		client: BotClient
	): Promise<void> => {
		client.connection.killConnection();
		await interaction.deferUpdate();
	};
}

export const button = new StopButton();
