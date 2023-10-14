import {
	type VoiceState,
	type Guild,
	type TextBasedChannel,
	type VoiceChannel,
} from 'discord.js';
import { NotifyEmbed } from '../bot/builders/embeds/notify';
import { type UtsukushiBotClient } from '../bot/client';
import logger from '../core/logger';
import { NotifyVCFinishEmbed } from '../bot/builders/embeds/notify-vc-finish';
import { PlayerService } from './player-service';

export class VoiceChannelService {
	private static readonly actifChannels: Record<string, Date> = {};

	private static async getNotifyChannel(
		client: UtsukushiBotClient,
		guild: Guild,
	): Promise<TextBasedChannel | null> {
		const data = await client.store.guilds.getOrAddItemByGuild(guild);
		if (!data?.vocalNotifyChannel) return null;
		return (await guild.channels.fetch(
			data.vocalNotifyChannel,
		)) as TextBasedChannel;
	}

	static async notifyUserJoinVocal(
		client: UtsukushiBotClient,
		user: string,
		channelId: string,
		guild: Guild,
	): Promise<void> {
		const channelNotify = await this.getNotifyChannel(client, guild);
		if (channelNotify) {
			const vc = (await guild.channels.fetch(channelId)) as VoiceChannel;
			const userJoin = (await guild.members.fetch(user)).user;

			const embed = new NotifyEmbed(userJoin, vc);
			channelNotify?.send({ embeds: [embed] }).catch((err: Error) => {
				logger.error({}, err.message);
			});
		}
	}

	static async conversationStarted(
		_oldState: VoiceState,
		newState: VoiceState,
	): Promise<void> {
		const channelId = newState.channelId;
		if (!channelId) return;
		if (
			newState.channel?.members.size === 2 &&
			!VoiceChannelService.actifChannels[channelId]
		)
			VoiceChannelService.actifChannels[channelId] = new Date(Date.now());
	}

	static async conversationFinished(
		client: UtsukushiBotClient,
		oldState: VoiceState,
		_newState: VoiceState,
	): Promise<void> {
		const guild = oldState.guild;
		const channelId = oldState.channelId;
		if (!channelId) return;
		const channelNotify = await this.getNotifyChannel(client, guild);
		if (
			channelNotify &&
			oldState.channel?.members.size === 0 &&
			VoiceChannelService.actifChannels[channelId]
		) {
			const vc = (await guild.channels.fetch(channelId)) as VoiceChannel;
			const start = VoiceChannelService.actifChannels[channelId].getTime();
			const end = Date.now();
			const embed = new NotifyVCFinishEmbed(vc, (end - start));
			channelNotify?.send({ embeds: [embed], flags: [ 4096 ] }).catch((err: Error) => {
				logger.error({}, err.message);
			});
		}
	}

	static async playSoundEffect(
		client: UtsukushiBotClient,
		userId: string,
		channelId: string,
		guild: Guild,
	): Promise<void> {
		const channelNotify = await this.getNotifyChannel(client, guild);
		if (channelNotify) {
			const vc = (await guild.channels.fetch(channelId)) as VoiceChannel;
			const userJoin = (await guild.members.fetch(userId)).user;

			const user = await client.store.users.getItem(userJoin.id);
			if (user?.anthem) await PlayerService.playSoundEffectVC(vc, guild, user.anthem.url);
		}
	}
}
