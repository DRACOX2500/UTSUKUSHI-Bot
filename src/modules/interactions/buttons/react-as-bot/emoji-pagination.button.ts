/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-empty-function */
import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { ReactAsBotContextReply } from '@modules/interactions/contexts/react-as-bot/react-as-bot.reply';
import { UtsukushiButton } from '@models/UtsukushiInteraction';

export namespace ReactAsBotButtons {

	export class NextButton implements UtsukushiButton {

		readonly button = (disabled = false): ButtonBuilder => {
			return new ButtonBuilder()
				.setCustomId('rab-next')
				.setEmoji('⏩')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(disabled);
		};

		readonly getEffect = async (interaction: ButtonInteraction, client: BotClient): Promise<void> => {

			const emojis = client.getDatabase().dataCache.emojiCache;

			const mes = interaction.message;
			const targetId = mes.content.split('#')[1].split(' with')[0];

			const s1 = mes.content.split('(')[1].split(' to ');
			const start = +s1[0];
			const reply = new ReactAsBotContextReply(targetId, emojis, start + 24);

			await interaction.reply({ ...reply, ephemeral: true });
		};

	}

	export class PreviousButton implements UtsukushiButton {

		readonly button = (disabled = false): ButtonBuilder => {
			return new ButtonBuilder()
				.setCustomId('rab-previous')
				.setEmoji('⏪')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(disabled);
		};

		readonly getEffect = async (interaction: ButtonInteraction, client: BotClient): Promise<void> => {

			const emojis = client.getDatabase().dataCache.emojiCache;

			const mes = interaction.message;
			const targetId = mes.content.split('#')[1].split(' with')[0];

			const s1 = mes.content.split('(')[1].split(' to ');
			const start = +s1[0];
			const reply = new ReactAsBotContextReply(targetId, emojis, start - 24);

			await interaction.reply({ ...reply, ephemeral: true });
		};

	}
}

export const buttons = [
	new ReactAsBotButtons.NextButton(),
	new ReactAsBotButtons.PreviousButton(),
];