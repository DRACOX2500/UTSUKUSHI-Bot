import { bold, ChatInputCommandInteraction, EmbedBuilder, Guild, italic, time } from 'discord.js';
import { EmbedGuildData } from '@models/embeds/embed-guild-data.model';
import { UtsukushiClient } from 'src/utsukushi-client';
import { logger } from '../logger/logger';

export class GuildEmbed {
	guildSource: Guild;
	guild: EmbedGuildData;
	client: UtsukushiClient;

	private joinedAt!: Date;

	constructor(guild: Guild, client: UtsukushiClient, interaction: ChatInputCommandInteraction) {
		this.guildSource = guild;
		this.guild = <EmbedGuildData>(<unknown>guild);
		this.guild.iconUrl = guild.iconURL() ?? '';
		this.guild.bannerUrl = guild.bannerURL() ?? '';
		this.client = client;
		interaction.guild?.members.fetch(interaction.user.id)
			.then(user => {
				this.joinedAt = <Date>user.joinedAt;
			}).catch((err: Error) => logger.error({}, err.message));
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
				{ name: 'Joined At', value: time(this.joinedAt) },
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
		const data = await this.client.data.guilds.getByKey(this.guildSource.id);
		let share = '';
		if (data) share = `[Shared to Utsukushi : ${data.value.shareEmojis ? '✅' : '❌'}]`;

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
			bold(`Emojis (${guildEmojis.size}) ${share}:\n`) +
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
