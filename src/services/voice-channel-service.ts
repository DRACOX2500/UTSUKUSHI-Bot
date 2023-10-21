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

	private static hasMinimumMenber(state: VoiceState): boolean {
		return state.channel?.members.size === 2;
	}

	private static isEmpty(state: VoiceState): boolean {
		return state.channel?.members.size === 0;
	}

	private static isActif(id: string): boolean {
		return !!this.actifChannels[id];
	}

	private static isNotActif(id: string): boolean {
		return !this.actifChannels[id];
	}

	private static get(id: string): Date | null {
		return this.actifChannels[id];
	}

	private static start(id: string): void {
		this.actifChannels[id] = new Date(Date.now());
	}

	private static end(id: string): void {
		delete this.actifChannels[id];
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
		newState: VoiceState,
	): Promise<void> {
		const channelId = newState.channelId;
		if (!channelId) return;
		if (
			channelId &&
			this.hasMinimumMenber(newState) &&
			this.isNotActif(channelId)
		)
			this.start(channelId);
	}

	static async conversationFinished(
		client: UtsukushiBotClient,
		oldState: VoiceState,
	): Promise<void> {
		const guild = oldState.guild;
		const channelId = oldState.channelId;
		if (!channelId) return;
		const start = this.get(channelId)?.getTime();
		const end = Date.now();
		const channelNotify = await this.getNotifyChannel(client, guild);
		if (
			channelNotify && start &&
			this.isEmpty(oldState) &&
			this.isActif(channelId)
		) {
			const vc = (await guild.channels.fetch(channelId)) as VoiceChannel;
			const embed = new NotifyVCFinishEmbed(vc, (end - start));
			channelNotify?.send({ embeds: [embed], flags: [ 4096 ] }).catch((err: Error) => {
				logger.error({}, err.message);
			});
			this.end(channelId);
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
