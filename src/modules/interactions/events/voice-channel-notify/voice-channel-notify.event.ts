import { Guild, TextBasedChannel, VoiceChannel } from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';
import { NotifyEmbed } from '@modules/system/embeds/notify.embed';
import { UtsukushiEvent } from '@models/utsukushi-interaction.model';
import { logger } from 'root/src/modules/system/logger/logger';

class VoiceChannelNotifyEvent implements UtsukushiEvent {
	private async notifyGuild(
		client: UtsukushiClient,
		user: string,
		channelId: string,
		guild: Guild
	): Promise<void> {
		const data = await client.data.guilds.getByKey(guild.id);
		if (data?.value.vocalNotifyChannel) {
			const channelNotify: TextBasedChannel = await guild.channels
				.fetch(data.value.vocalNotifyChannel)
				.then((result) => {
					return <TextBasedChannel>result;
				});
			const userJoin = (await guild.members.fetch(user)).user;
			const channel = await guild.channels.fetch(channelId).then((result) => {
				return <VoiceChannel>result;
			});
			const embedNotify = new NotifyEmbed(userJoin, channel);
			const embed = embedNotify.getEmbed();
			channelNotify?.send({ embeds: [embed] }).catch((err: Error) => logger.error({}, err.message));
		}
	}

	readonly event = async (client: UtsukushiClient): Promise<void> => {
		client.on('voiceStateUpdate', async (oldState, newState) => {
			if (oldState.channelId === newState.channelId) {
				// 'a user has not moved!'
			}
			if (
				oldState.channelId != null &&
				newState.channelId != null &&
				newState.channelId != oldState.channelId
			) {
				// 'a user switched channels'
			}
			if (oldState.channelId === null) {
				if (newState.member?.user.bot) return;
				// 'a user joined!'
				const user = newState.id;
				const channelId = <string>newState.channelId;
				const guild = newState.guild;
				this.notifyGuild(client, user, channelId, guild).catch((err: Error) => logger.error({}, err.message));
			}
			if (newState.channelId === null) {
				// 'a user left!'
			}
		});
	};
}

export default new VoiceChannelNotifyEvent();
