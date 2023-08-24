import { PermissionsBitField } from 'discord.js';
import { BotSlashCommand } from '../../../../core/bot-command';
import { type UtsukushiBotClient } from '../../../client';
import { DisplaySubCommand } from './display/display.sub';
import { RemoveSubCommand } from './remove/remove.sub';


/**
 * @SlashCommand `guild-cache`
 * 	- `guild-cache show` : Show Guild data !
 *  - `guild-cache remove` : Remove Guild data !
 */
class GuildCacheCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
			'display': new DisplaySubCommand(),
			'remove': new RemoveSubCommand(),
		});

		this.command
			.setName('guild-cache')
			.setDescription('Manage guild data 🏛️!')
			.setDMPermission(false)
			.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild);
	}
}

export const command = new GuildCacheCommand();