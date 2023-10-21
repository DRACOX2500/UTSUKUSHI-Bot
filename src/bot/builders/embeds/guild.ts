import { EmbedBuilder, type Guild, type GuildMember, time } from 'discord.js';
import { BotClient } from '../../../core/bot-client';

export class GuildEmbed extends EmbedBuilder {

	constructor(
		guild: Guild,
		owner: GuildMember,
		user: GuildMember,
	) {
		super();

		const avatarUrl = owner.user.avatarURL() ?? undefined;
		const joinedAt = user.joinedAt as Date;

		this
			.setColor(BotClient.color)
			.setAuthor({
				name: owner.user.username,
				iconURL: avatarUrl,
			})
			.setTitle(guild.name)
			.setURL(`https://discord.com/channels/${guild.id}`)
			.setThumbnail(guild.iconURL())
			.setFields(
				{ name: 'Created At', value: time(guild.createdAt) },
				{ name: 'Joined At', value: time(joinedAt) },
				{ name: 'Member Count', value: String(guild.memberCount) },
				{
					name: 'Booster Count',
					value: String(guild.premiumSubscriptionCount),
				},
				{ name: 'Locale', value: guild.preferredLocale },
			);
	}
}