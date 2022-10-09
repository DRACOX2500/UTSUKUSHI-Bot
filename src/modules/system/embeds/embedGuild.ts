import {
	bold,
	codeBlock,
	EmbedBuilder,
	Guild,
	italic,
	time,
} from 'discord.js';
import { EmbedGuildData } from '@models/embeds/EmbedGuildData';
import { BotClient } from 'src/BotClient';

export class EmbedGuild {
	guild: EmbedGuildData;
	client: BotClient;

	constructor(guild: Guild, client: BotClient) {
		this.guild = <EmbedGuildData>(<unknown>guild);
		this.guild.iconUrl = guild.iconURL() ?? '';
		this.guild.bannerUrl = guild.bannerURL() ?? '';
		this.client = client;
	}

	async getEmbed(): Promise<EmbedBuilder> {
		const embed = new EmbedBuilder();
		const owner = await this.client.users.fetch(this.guild.ownerId);
		if (owner)
			embed.setAuthor({
				name: `Created by ${owner.username}`,
				iconURL: <string>owner.avatarURL(),
			});
		if (this.guild.bannerUrl !== '') embed.setImage(this.guild.bannerUrl);

		return embed
			.setTitle(this.guild.name)
			.setURL(`https://discord.com/channels/${this.guild.id}`)
			.setColor(0xf9ff00)
			.setThumbnail(this.guild.iconUrl)
			.setFields(
				{ name: 'Created At', value: time(this.guild.createdAt) },
				{ name: 'Joined At', value: time(this.guild.joinedAt) },
				{ name: 'Member Count', value: String(this.guild.memberCount) },
				{
					name: 'Booster Count',
					value: String(this.guild.premiumSubscriptionCount),
				},
				{ name: 'Locale', value: this.guild.preferredLocale }
			);
	}

	async getEmbedExtra(): Promise<EmbedBuilder> {
		const embed = new EmbedBuilder();

		let emojis = '';
		const guildEmojis = await this.guild.emojis.fetch();
		guildEmojis.forEach((emoji) => {
			emojis += `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}> `;
		});

		let stickers = '';
		const guildStickers = await this.guild.stickers.fetch();
		guildStickers.forEach((stiker) => {
			stickers += ` - ${stiker.name}`;
		});

		let roles = '';
		const guildRoles = await this.guild.roles.fetch();
		guildRoles.forEach((role) => {
			roles += `<@&${role.id}> `;
		});

		let bans = '';
		const guildBans = await this.guild.bans.fetch();
		guildBans.forEach((ban) => {
			bans += ` - ${ban.user.username} ${
				ban.user.bot ? '`(Bot)`' : ''
			}: ${italic(ban.reason ?? '')}\n`;
		});

		let desc =
			bold(`Emojis (${guildEmojis.size}) :\n`) +
			emojis +
			'\n\n' +
			bold(`Stickers (${guildStickers.size}) :\n`) +
			stickers +
			'\n\n' +
            bold(`Roles (${guildRoles.size}) :\n`) +
			roles +
			'\n\n' +
            bold(`Banned Users (${guildBans.size}) :\n`) +
                bans +
                '\n\n';

		if (desc.length > 1950) desc = desc.slice(0, 1950);

		return embed
			.setTitle(`${this.guild.name} extra data`)
			.setColor(0xf9ff00)
			.setDescription(desc);
	}
}
