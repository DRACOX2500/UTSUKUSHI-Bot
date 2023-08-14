import { BotClient } from "@/core/bot-client";
import { logger } from "@/core/logger";
import { BotTrigger } from "@/core/types/bot-interaction";
import { Guild } from "discord.js";

/**
 * @Trigger `voice-channel-notify`
 *  - `voice-channel-notify` : Send notification in targeted channel
 */
export class VoiceChannelNotifyTrigger implements BotTrigger {
	private async notifyGuild(
		client: BotClient,
		user: string,
		channelId: string,
		guild: Guild
	): Promise<void> {
		// const data = await client.data.guilds.getByKey(guild.id);
		// if (data?.value.vocalNotifyChannel) {
			// const channelNotify: TextBasedChannel = await guild.channels
			// 	.fetch(data.value.vocalNotifyChannel)
			// 	.then((result) => {
			// 		return result as TextBasedChannel;
			// 	});
			// const userJoin = (await guild.members.fetch(user)).user;
			// const channel = await guild.channels.fetch(channelId).then((result) => {
			// 	return result;
			// });
			// const embedNotify = new NotifyEmbed(userJoin, channel);
			// const embed = embedNotify.getEmbed();
			// channelNotify?.send({ embeds: [embed] }).catch((err: Error) => logger.error({}, err.message));
		// }
	}

	readonly trigger = async (client: BotClient): Promise<void> => {
		client.on('voiceStateUpdate', async (oldState, newState) => {
			// TODO: rework
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
				const channelId = newState.channelId as string;
				const guild = newState.guild;
				this.notifyGuild(client, user, channelId, guild).catch((err: Error) => logger.error({}, err.message));
			}
			if (newState.channelId === null) {
				// 'a user left!'
			}
		});
	};
}
