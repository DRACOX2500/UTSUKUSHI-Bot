import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { UtsukushiButton } from '@models/utsukushi-interaction.model';
import { UtsukushiClient } from 'src/utsukushi-client';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace SpeakAsBotButtons {
	export class ConfirmButton implements UtsukushiButton {
		readonly button = (disabled = false): ButtonBuilder => {
			return new ButtonBuilder()
				.setCustomId('sab-comfirm')
				.setEmoji('✅')
				.setLabel('Yes, I Confirm !')
				.setStyle(ButtonStyle.Success)
				.setDisabled(disabled);
		};

		readonly getEffect = async (
			interaction: ButtonInteraction,
			client: UtsukushiClient
		): Promise<void> => {
			const userId = interaction.user.id;
			const message = client.getDatabase().tempory.get(`sab-${userId}`);
			if (!message) {
				await interaction.deferUpdate();
				return;
			}
			client.getDatabase().tempory.delete(`sab-${userId}`);

			await interaction.channel?.send({ content: message.message, files: message.attachments });
			await interaction.deferUpdate();
		};
	}

	export class CancelButton implements UtsukushiButton {
		readonly button = (disabled = false): ButtonBuilder => {
			return new ButtonBuilder()
				.setCustomId('sab-cancel')
				.setEmoji('⛔')
				.setLabel('Uh... No !')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(disabled);
		};

		readonly getEffect = async (
			interaction: ButtonInteraction,
			client: UtsukushiClient
		): Promise<void> => {
			const userId = interaction.user.id;
			client.getDatabase().tempory.delete(`sab-${userId}`);
			await interaction.deferUpdate();
		};
	}
}

export const buttons = [
	new SpeakAsBotButtons.ConfirmButton(),
	new SpeakAsBotButtons.CancelButton(),
];