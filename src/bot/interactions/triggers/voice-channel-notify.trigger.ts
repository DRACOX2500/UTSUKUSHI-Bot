import { type UtsukushiBotClient } from '../../../bot/client';
import { type BotTrigger } from '../../../core/types/bot-interaction';
import { VoiceChannelService } from '../../../services/voice-channel-service';

/**
 * @Trigger `voice-channel-notify`
 *  - `voice-channel-notify` : Send notification in targeted channel
 */
class VoiceChannelNotifyTrigger implements BotTrigger<UtsukushiBotClient> {

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

				await VoiceChannelService.conversationStarted(oldState, newState);

				const user = newState.id;
				const channelId = newState.channelId as string;
				const guild = newState.guild;
				await VoiceChannelService.notifyUserJoinVocal(client, user, channelId, guild);
			}
			else if (newState.channelId === null) {
				// 'a user left!'
				await VoiceChannelService.conversationFinished(client, oldState, newState);
			}
		});
	};
}

export const trigger = new VoiceChannelNotifyTrigger();