import { APIEmbedField, ButtonInteraction, EmbedBuilder, InteractionResponse } from 'discord.js';
import { BotPlayer } from '../../../class/BotPlayer';
import { BotClient } from '../../../class/BotClient';
import { BUTTON } from '../../../utils/const';

export class ButtonVolume {

	interaction!: ButtonInteraction;
	client!: BotClient;

	constructor(interaction: ButtonInteraction, client: BotClient) {
		this.interaction = interaction;
		this.client = client;
	}

	private isNotOK() {
		return !this.client.connection.botPlayer?.resource ||
		this.interaction.message.embeds[0].data.fields === undefined ||
		(this.client.connection.botPlayer?.origin &&
		this.interaction.message.id !== this.client.connection.botPlayer?.origin?.id);
	}

	async getDownEffect(): Promise<InteractionResponse | void> {
		if (this.isNotOK())
			return this.interaction.reply(BUTTON.PLAY_RESPONSE);
		this.client.connection.botPlayer?.volumeDown();

		(<APIEmbedField[]> this.interaction.message.embeds[0].data.fields)[5].value = ((<BotPlayer> this.client.connection.botPlayer).getVolume() * 100) + '%';

		const vDownEmbed = EmbedBuilder.from(this.interaction.message.embeds[0]);
		this.interaction.message.edit({ embeds: [vDownEmbed] });

		await this.interaction.deferUpdate();
	}

	async getUpEffect(): Promise<InteractionResponse | void> {
		if (this.isNotOK())
			return this.interaction.reply(BUTTON.PLAY_RESPONSE);
		this.client.connection.botPlayer?.volumeUp();

		(<APIEmbedField[]> this.interaction.message.embeds[0].data.fields)[5].value = ((<BotPlayer> this.client.connection.botPlayer).getVolume() * 100) + '%';

		const vUpEmbed = EmbedBuilder.from(this.interaction.message.embeds[0]);
		this.interaction.message.edit({ embeds: [vUpEmbed] });

		await this.interaction.deferUpdate();
	}
}