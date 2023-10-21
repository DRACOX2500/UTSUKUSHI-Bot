import { BotClient } from '../../../core/bot-client';
import { DiscordService } from '../../../services/discord-service';
import { EmbedBuilder, type Guild, type GuildBan, italic } from 'discord.js';

export class GuildBanEmbed extends EmbedBuilder {

	constructor(
		guild: Guild,
		bans: GuildBan[],
	) {
		super();

		const bansDesc = bans.map((ban) =>
			` - ${ban.user.username} ${ban.user.bot ? '`(Bot)`' : ''}: ${italic(ban.reason ?? '')}`,
		).join('\n');

		this
			.setColor(BotClient.color)
			.setTitle(`${guild.name}'s Users Banned (${bans.length})`)
			.setDescription(DiscordService.limitText(bansDesc, 1950));
	}
}