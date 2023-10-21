import { type VoiceState } from 'discord.js';
import { type UtsukushiBotClient } from '../../../bot/client';
import { type BotTrigger } from '../../../core/types/bot-interaction';
import { VoiceChannelService } from '../../../services/voice-channel-service';

/**
 * @Trigger `voice-channel-notify`
 *  - `voice-channel-notify` : Send notification in targeted channel
 */
class VoiceChannelNotifyTrigger implements BotTrigger<UtsukushiBotClient> {
	private async onJoin(
		oldState: VoiceState,
		newState: VoiceState,
		client: UtsukushiBotClient,
	): Promise<void> {
		// 'a user joined!'

		await VoiceChannelService.conversationStarted(newState);

		const user = newState.id;
		const channelId = newState.channelId as string;
		const guild = newState.guild;
		await VoiceChannelService.notifyUserJoinVocal(
			client,
			user,
			channelId,
			guild,
		);
		// await VoiceChannelService.playSoundEffect(client, user, channelId, guild);
	}

	private async onJoinBot(
		oldState: VoiceState,
		newState: VoiceState,
		client: UtsukushiBotClient,
	): Promise<void> {
		// 'a bot joined!'
		await VoiceChannelService.conversationStarted(newState);
	}

	private async onSwitch(
		oldState: VoiceState,
		newState: VoiceState,
		client: UtsukushiBotClient,
	): Promise<void> {
		// 'a user switched channels'
		await VoiceChannelService.conversationFinished(client, oldState);
		await VoiceChannelService.conversationStarted(newState);
	}

	private async onStay(
		oldState: VoiceState,
		newState: VoiceState,
		client: UtsukushiBotClient,
	): Promise<void> {
		// 'a user has not moved!'
	}

	private async onQuit(
		oldState: VoiceState,
		newState: VoiceState,
		client: UtsukushiBotClient,
	): Promise<void> {
		// 'a user left!'
		await VoiceChannelService.conversationFinished(client, oldState);
	}

	readonly trigger = async (client: UtsukushiBotClient): Promise<void> => {
		client.on('voiceStateUpdate', async (oldState, newState) => {
			if (oldState.channelId != null && newState.channelId != null) {
				if (oldState.channelId === newState.channelId) {
					await this.onStay(oldState, newState, client);
				}
				else {
					await this.onSwitch(oldState, newState, client);
				}
			}
			else if (oldState.channelId === null) {
				if (newState.member?.user.bot)
					await this.onJoinBot(oldState, newState, client);
				else this.onJoin(oldState, newState, client);
			}
			else if (newState.channelId === null) {
				await this.onQuit(oldState, newState, client);
			}
		});
	};
}

export const trigger = new VoiceChannelNotifyTrigger();
