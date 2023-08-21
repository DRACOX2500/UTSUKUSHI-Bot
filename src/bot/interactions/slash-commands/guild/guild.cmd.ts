import { PermissionsBitField } from "discord.js";
import { LocaleSubCommand } from "./locale/locale.sub";
import { NotifySubCommand } from "./notify/notify.sub";
import { SharedEmojisSubCommand } from "./shared-emojis/shared-emojis.sub";
import { InfoSubCommand } from "./info/info.sub";
import { BotSlashCommand } from "../../../../core/bot-command";
import { UtsukushiBotClient } from "../../../client";

/**
 * @SlashCommand `guild`
 * 	- `guild info [id?]` : Guild informations !
 *  - `guild locale` : Change Guild Language !
 *  - `guild notify` : Enabled/Disabled Vocal Channel Notifications !
 *  - `guild shared-emojis` : Enabled/Disabled Emojis Share !
 */
class GuildCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
			'info': new InfoSubCommand(),
			'locale': new LocaleSubCommand(),
			'notify': new NotifySubCommand(),
            'shared-emojis': new SharedEmojisSubCommand()
		});

		this.command
			.setName('guild')
			.setDescription('Commands about guild 🏛️!')
			.setDMPermission(false)
            .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild);
	}
}

export const command = new GuildCommand();