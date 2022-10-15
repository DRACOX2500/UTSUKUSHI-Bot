/* eslint-disable @typescript-eslint/no-namespace */
import {
	APIEmbedField,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import { BotPlayer } from '@modules/system/audio/BotPlayer';
import { BotClient } from 'src/BotClient';
import { BUTTON } from '@utils/const';
import { UtsukushiButton } from '@models/UtsukushiInteraction';

function isNotOK(interaction: ButtonInteraction, client: BotClient): boolean {
	return (
		!client.connection.botPlayer?.resource ||
		interaction.message.embeds[0].data.fields === undefined ||
		(client.connection.botPlayer?.origin &&
			interaction.message.id !== client.connection.botPlayer?.origin?.id)
	);
}

export namespace VolumeButtons {
	export class VolumeDownButton implements UtsukushiButton {
		readonly button = (disabled = false): ButtonBuilder => {
			return new ButtonBuilder()
				.setCustomId('play-vdown')
				.setEmoji('<:vold:937333517258469416>')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled);
		};

		readonly getEffect = async (
			interaction: ButtonInteraction,
			client: BotClient
		): Promise<void> => {
			if (isNotOK(interaction, client)) {
				interaction.reply(BUTTON.PLAY_RESPONSE);
				return;
			}

			client.connection.botPlayer?.volumeDown();

			(<APIEmbedField[]>interaction.message.embeds[0].data.fields)[5].value =
				(<BotPlayer>client.connection.botPlayer).getVolume() * 100 + '%';

			const vDownEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
			interaction.message.edit({ embeds: [vDownEmbed] });

			await interaction.deferUpdate();
		};
	}

	export class VolumeUpButton implements UtsukushiButton {
		readonly button = (disabled = false): ButtonBuilder => {
			return new ButtonBuilder()
				.setCustomId('play-vup')
				.setEmoji('<:volp:937332469798162462>')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled);
		};

		readonly getEffect = async (
			interaction: ButtonInteraction,
			client: BotClient
		): Promise<void> => {
			if (isNotOK(interaction, client)) {
				interaction.reply(BUTTON.PLAY_RESPONSE);
				return;
			}
			client.connection.botPlayer?.volumeUp();

			(<APIEmbedField[]>interaction.message.embeds[0].data.fields)[5].value =
				(<BotPlayer>client.connection.botPlayer).getVolume() * 100 + '%';

			const vUpEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
			interaction.message.edit({ embeds: [vUpEmbed] });

			await interaction.deferUpdate();
		};
	}
}

export const buttons = [
	new VolumeButtons.VolumeDownButton(),
	new VolumeButtons.VolumeUpButton(),
];
