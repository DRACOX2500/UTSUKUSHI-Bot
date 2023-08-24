import { type ButtonInteraction, type CacheType } from 'discord.js';
import { BotButton } from '../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../client';
import { PlayerService } from '../../../../services/player-service';
import { PauseButton } from '../../../builders/buttons/pause';


class Button extends BotButton<UtsukushiBotClient> {
	button = new PauseButton('track-pause');
	override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const guild = interaction.guild;

		if (guild) {
			PlayerService.togglePause(guild);
		}
		await interaction.deferUpdate();
	}
}

export const button = new Button();