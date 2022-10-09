import { bold, EmbedBuilder, User, VoiceChannel } from 'discord.js';
import { BotClient } from 'src/BotClient';

export class EmbedNotify {

	userId!: string;
	userName!: string;
	userDiscriminator!: string;
	userImageUrl!: string;
	channelName!: string;
	guildName!: string;
	guildImageUrl!: string;

	constructor(user: User, channel: VoiceChannel) {
		this.userId = user.id;
		this.userName = user.username;
		this.userDiscriminator = user.discriminator;
		this.userImageUrl = <string>user.avatarURL();
		this.channelName = channel.name;
		this.guildName = channel.guild.name;
		this.guildImageUrl = <string>channel.guild.iconURL();
	}

	getEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xF9FF00)
			.setAuthor({ name: `${this.userName}#${this.userDiscriminator}`, iconURL: this.userImageUrl })
			.setDescription(`🔔 <@${this.userId}> joined voice channel ${bold(this.channelName)}`)
			.setTimestamp()
			.setFooter({ text: this.guildName, iconURL: this.guildImageUrl });
	}


}