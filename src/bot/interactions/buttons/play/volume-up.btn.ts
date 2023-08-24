import { type ButtonInteraction, type CacheType } from 'discord.js';
import { BotButton } from '../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../client';
import { PlayerService } from '../../../../services/player-service';
import { VolumeUpButton } from '../../../builders/buttons/volume-up';


class Button extends BotButton<UtsukushiBotClient> {
	button = new VolumeUpButton('track-volume-up');
	override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const guild = interaction.guild;

		if (guild) {
			PlayerService.volumeUp(guild);
		}
		await interaction.deferUpdate();
	}
}

export const button = new Button();