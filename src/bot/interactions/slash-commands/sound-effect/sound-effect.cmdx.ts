import { BotSlashCommand } from "../../../../core/bot-command";
import { UtsukushiBotClient } from "../../../client";
import { AddSubCommand } from "./add/add.sub";
import { PlaySubCommand } from './play/play.sub';
import { RemoveSubCommand } from "./remove/remove.sub";

/**
 * @SlashCommand `sound-effect`
 * 	- `sound-effect` : ... !
 */
class GuildCacheCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
            'add': new AddSubCommand(),
            'play': new PlaySubCommand(),
            'remove': new RemoveSubCommand(),
        });

		this.command
			.setName('sound-effect')
			.setDescription('Manage sound-effect 🎵!')
			.setDMPermission(true);
	}
}

export const command = new GuildCacheCommand();