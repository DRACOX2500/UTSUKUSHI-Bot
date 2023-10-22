import { type ChatInputCommandInteraction, type CacheType } from 'discord.js';
import { BotSlashCommand } from '../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../client';
import { PlayerService } from '../../../../services/player-service';

/**
 * @SlashCommand `radio-garden`
 */
class RadioGardenCommand extends BotSlashCommand<UtsukushiBotClient> {
	constructor() {
		super({});

		this.command
			.setName('radio-garden')
			.setDescription('Play Radio from Radio-Garden 🎵!')
			.setDMPermission(false);
	}

	override async result(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiBotClient,
		options?: any,
	): Promise<void> {
		await PlayerService.playRadio(interaction);
		interaction.reply('radio');
	}
}

export const command = new RadioGardenCommand();
