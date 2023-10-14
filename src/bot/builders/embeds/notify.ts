import { bold, EmbedBuilder, type User, type VoiceChannel } from 'discord.js';

export class NotifyEmbed extends EmbedBuilder {

	constructor(user: User, channel: VoiceChannel) {
		super();

		const avatarURL = user.avatarURL() ?? undefined;
		const guildIconURL = channel.guild.iconURL() ?? undefined;


		this
			.setColor(0xf9ff00)
			.setAuthor({
				name: `${user.globalName} (${user.username})`,
				iconURL: avatarURL,
			})
			.setDescription(
				`🔔 ${user.globalName} joined voice channel ${bold(channel.name)}`,
			)
			.setTimestamp()
			.setFooter({ text: channel.guild.name, iconURL: guildIconURL });
	}
}