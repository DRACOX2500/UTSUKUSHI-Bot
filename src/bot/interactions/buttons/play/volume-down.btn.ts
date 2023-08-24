import { type ButtonInteraction, type CacheType } from 'discord.js';
import { BotButton } from '../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../client';
import { PlayerService } from '../../../../services/player-service';
import { VolumeDownButton } from '../../../builders/buttons/volume-down';


class Button extends BotButton<UtsukushiBotClient> {
	button = new VolumeDownButton('track-volume-down');
	override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const guild = interaction.guild;

		if (guild) {
			PlayerService.volumeDown(guild);
		}
		await interaction.deferUpdate();
	}
}

export const button = new Button();