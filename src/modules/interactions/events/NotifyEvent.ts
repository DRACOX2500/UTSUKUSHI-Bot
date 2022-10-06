import { Guild, TextBasedChannel, VoiceChannel } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { EmbedNotify } from '@modules/system/embeds/embedNotify';

export class NotifyEvent {

	async notifyGuild(client: BotClient, user: string, channelId: string, guild: Guild): Promise<void> {
		const data = await client.getDatabase().getCacheByGuild(guild);
		if (data?.vocalNotifyChannel) {
			const channelNotify: TextBasedChannel = await guild.channels.fetch(data.vocalNotifyChannel).then((result) => {return <TextBasedChannel>result; });
			const userJoin = (await guild.members.fetch(user)).user;
			const channel = await guild.channels.fetch(channelId).then((result) => {return <VoiceChannel>result; });
			const embedNotify = new EmbedNotify(userJoin, channel);
			const embed = embedNotify.getEmbed();
			channelNotify?.send({ embeds: [embed] });
		}
	}
}