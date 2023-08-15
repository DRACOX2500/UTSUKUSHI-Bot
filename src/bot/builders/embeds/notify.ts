import { bold, EmbedBuilder, User, userMention, VoiceChannel } from 'discord.js';

export class NotifyEmbed extends EmbedBuilder {

	constructor(user: User, channel: VoiceChannel) {
        super();

        const avatarURL = user.avatarURL() ?? undefined;
        const guildIconURL = channel.guild.iconURL() ?? undefined;


        this
            .setColor(0xf9ff00)
			.setAuthor({
				name: user.username,
				iconURL: avatarURL,
			})
			.setDescription(
				`🔔 ${userMention(user.id)} joined voice channel ${bold(channel.name)}`
			)
			.setTimestamp()
			.setFooter({ text: channel.guild.name, iconURL: guildIconURL });
	}
}