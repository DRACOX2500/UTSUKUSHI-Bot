import { UtsukushiBotClient } from "@/bot/client";
import { BotSlashCommand } from "@/core/bot-command";
import { PingSubCommand } from "./ping/ping.sub";
import { GitSubCommand } from "./git/git.sub";

/**
 * @SlashCommand `bot`
 *  - `bot git` : Get GitHub link !
 *  - `bot ping` : Ping Bot !
 */
class BotCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super({
			'git': new GitSubCommand(),
			'ping': new PingSubCommand()
		});

		this.command
			.setName('bot')
			.setDescription('Commands about bot 🤖!')
			.setDMPermission(true);
	}
}

export const command = new BotCommand();