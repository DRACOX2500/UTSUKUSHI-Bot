import { BotSlashCommand } from "../../../../core/bot-command";
import { UtsukushiBotClient } from "../../../client";
import { FilterSubCommand } from "./filter/filter.sub";
import { PlaySubCommand } from "./play/play.sub";
import { SkipSubCommand } from "./skip/skip.sub";
import { StopSubCommand } from "./stop/stop.sub";
import { VolumeSubCommand } from "./volume/volume.sub";

/**
 * @SlashCommand `music`
 */
class MusicCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
            'play': new PlaySubCommand(),
            'stop': new StopSubCommand(),
            'skip': new SkipSubCommand(),
            'volume': new VolumeSubCommand(),
			'filter': new FilterSubCommand(),
        });

		this.command
			.setName('music')
			.setDescription('Manage music system 🎵!')
			.setDMPermission(false);
	}
}

export const command = new MusicCommand();