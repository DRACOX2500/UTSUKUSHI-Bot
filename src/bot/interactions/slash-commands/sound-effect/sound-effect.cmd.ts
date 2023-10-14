import { BotSlashCommand } from '../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../client';
import { AddSubCommand } from './add/add.sub';
import { PlaySubCommand } from './play/play.sub';
import { RemoveSubCommand } from './remove/remove.sub';
import { SetAnthemSubCommand } from './set-anthem/set-anthem.sub';

/**
 * @SlashCommand `sound-effect`
 * 	- `sound-effect` : play, add or remove sound-effects !
 */
class SoundEffectCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
			'add': new AddSubCommand(),
			'play': new PlaySubCommand(),
			'remove': new RemoveSubCommand(),
			'set-anthem': new SetAnthemSubCommand(),
		});

		this.command
			.setName('sound-effect')
			.setDescription('Manage sound-effect 🎵!')
			.setDMPermission(true);
	}
}

export const command = new SoundEffectCommand();