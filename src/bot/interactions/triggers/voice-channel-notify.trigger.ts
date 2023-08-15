import { NotifyEmbed } from "@/bot/builders/embeds/notify";
import { UtsukushiBotClient } from "@/bot/client";
import { logger } from "@/core/logger";
import { BotTrigger } from "@/core/types/bot-interaction";
import { Guild, TextBasedChannel, VoiceChannel } from "discord.js";

/**
 * @Trigger `voice-channel-notify`
 *  - `voice-channel-notify` : Send notification in targeted channel
 */
class VoiceChannelNotifyTrigger implements BotTrigger<UtsukushiBotClient> {
	private async notifyGuild(
		client: UtsukushiBotClient,
		user: string,
		channelId: string,
		guild: Guild
	): Promise<void> {
		const data = await client.store.guilds.getOrCreate(guild);
		if (data?.vocalNotifyChannel) {
			const channelNotify = await guild.channels
				.fetch(data.vocalNotifyChannel) as TextBasedChannel;
			const vc = await guild.channels.fetch(channelId) as VoiceChannel;
			const userJoin = (await guild.members.fetch(user)).user;

			const embed = new NotifyEmbed(userJoin, vc);
			channelNotify?.send({ embeds: [embed] }).catch((err: Error) => logger.error({}, err.message));
		}
	}

	readonly trigger = async (client: UtsukushiBotClient): Promise<void> => {
		client.on('voiceStateUpdate', async (oldState, newState) => {
			if (
				oldState.channelId != null &&
				newState.channelId != null
			) {
				// if (oldState.channelId === newState.channelId) {
				// 	// 'a user has not moved!'
				// }
				// else {
				// 	// 'a user switched channels'
				// }
			}
			else if (oldState.channelId === null) {
				if (newState.member?.user.bot) return;
				// 'a user joined!'
				const user = newState.id;
				const channelId = newState.channelId as string;
				const guild = newState.guild;
				this.notifyGuild(client, user, channelId, guild).catch((err: Error) => logger.error({}, err.message));
			}
			else if (newState.channelId === null) {
				// 'a user left!'
			}
		});
	};
}

export const trigger = new VoiceChannelNotifyTrigger();