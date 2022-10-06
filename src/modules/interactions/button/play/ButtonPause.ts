import { ButtonInteraction, InteractionResponse } from 'discord.js';
import { PlayCommand } from '@modules/interactions/commands/PlayCommand/play';
import { BotClient } from 'src/BotClient';

export class ButtonPause {

	interaction!: ButtonInteraction;
	client!: BotClient;

	constructor(interaction: ButtonInteraction, client: BotClient) {
		this.interaction = interaction;
		this.client = client;
	}

	async getEffect(): Promise<InteractionResponse | void> {
		if (!this.client.connection.botPlayer) {
			PlayCommand.reload(this.interaction, this.client);
			return this.interaction.deferUpdate();
		}

		const playerStatus = this.client.connection.botPlayer.player.state.status;
		if (playerStatus === 'paused')
			this.client.connection.botPlayer.player.unpause();
		else if (playerStatus === 'playing')
			this.client.connection.botPlayer.player.pause();

		await this.interaction.deferUpdate();
	}
}