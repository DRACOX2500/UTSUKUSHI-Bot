import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { PlayCommand } from '@modules/interactions/commands/PlayCommand/play.cmd';
import { BotClient } from 'src/BotClient';
import { UtsukushiButton } from '@models/UtsukushiInteraction';

export class PauseButton implements UtsukushiButton {

	readonly button = (disabled = false): ButtonBuilder => {
		return new ButtonBuilder()
			.setCustomId('play-pause')
			.setEmoji('<:p_:937332417738473503>')
			.setStyle(ButtonStyle.Success)
			.setDisabled(disabled);
	};

	readonly getEffect = async (interaction: ButtonInteraction, client: BotClient): Promise<void> => {
		if (!client.connection.botPlayer) {
			PlayCommand.reload(interaction, client);
			interaction.deferUpdate();
			return;
		}

		const playerStatus = client.connection.botPlayer.player.state.status;
		if (playerStatus === 'paused')
			client.connection.botPlayer.player.unpause();
		else if (playerStatus === 'playing')
			client.connection.botPlayer.player.pause();

		await interaction.deferUpdate();
	};
}

export const button = new PauseButton();