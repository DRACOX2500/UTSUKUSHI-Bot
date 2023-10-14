import {
	type VoiceChannel,
	type Guild,
	type GuildMember,
	type Interaction,
	type Message,
	type TextBasedChannel,
} from 'discord.js';
import { type UtsukushiBotClient } from '../bot/client';
import logger from '../core/logger';
import {
	AudioFilters,
	type GuildQueue,
	Player,
	type SearchResult,
	type Track,
} from 'discord-player';
import { TrackReply } from '../bot/builders/replies/track';
import { SortUtils } from '../core/utils/sort';
import { REGEX_LINK } from '../constants';

const SOURCES = ['auto', 'youtube', 'spotify', 'soundcloud'];

export class PlayerService {
	private static _player: Player;
	private static lastTrack: Record<string, Message> = {};

	private static saveTrackMessage(guildId: string, message: Message): void {
		PlayerService.lastTrack[guildId] = message;
	}

	private static async removeTrackMessage(guildId: string): Promise<void> {
		await PlayerService.lastTrack[guildId]?.delete();
	}

	static async init(client: UtsukushiBotClient): Promise<void> {
		const player = new Player(client, {
			ytdlOptions: {
				filter: 'audioonly',
				quality: 'highestaudio',
				highWaterMark: 1 << 30,
				requestOptions: {
					headers: {
						cookie: process.env.YOUTUBE_COOKIE ?? '',
					},
				},
			},
		});

		PlayerService._player = player;

		const res = await PlayerService._player.extractors.loadDefault();
		if (res.error) {
			logger.error('ERROR LOAD', res);
			logger.info(player.scanDeps());
			process.exit(1);
		}

		player.events.on('playerStart', async (queue, track) => {
			logger.info(
				`Started playing **${track.title}** [${queue.metadata.type}]!`,
			);
			if (queue.metadata.type === 'sound-effect') return;

			const channel: TextBasedChannel = queue.metadata.channel;
			const guildId: string = queue.metadata.guildId;
			if (channel && guildId) {
				PlayerService.removeTrackMessage(guildId);
				const reply = new TrackReply(track);
				const mes = await channel.send(reply);
				PlayerService.saveTrackMessage(guildId, mes);
			}
		});
		player.events.on('audioTrackAdd', (queue, track) => {
			logger.info(`Track **${track.title}** queued`);
		});
		player.events.on('audioTracksAdd', (queue, track) => {
			logger.info('Multiple Track\'s queued');
		});
		player.events.on('playerSkip', (queue, track) => {
			logger.info(`Skipping **${track.title}** due to an issue!`);
		});
		player.events.on('disconnect', (queue) => {
			logger.info('Looks like my job here is done, leaving now!');
		});
		player.events.on('emptyChannel', (queue) => {
			logger.info('Leaving because no vc activity for the past 5 minutes');
		});
		player.events.on('emptyQueue', (queue) => {
			logger.info('Queue finished!');
			this.disconnect(queue);
		});
		player.events.on('error', (queue, error) => {
			logger.error(`General player error event: ${error.message}`, error);
			this.disconnect(queue);
		});
		player.events.on('playerError', (queue, error) => {
			logger.error(`Player error event: ${error.message}`, error);
			this.disconnect(queue);
		});
	}

	private static disconnect(queue: GuildQueue): void {
		const guildId: string = (queue.metadata as any).guildId;
		if (guildId) {
			PlayerService.removeTrackMessage(guildId);
			PlayerService.stopByID(guildId);
		}
	}

	static get player(): Player {
		return PlayerService._player;
	}

	static get sourceChoices(): any[] {
		return SOURCES.map((_source) => ({
			name: _source.toUpperCase(),
			value: _source,
		}));
	}

	static get filters(): string[] {
		const list: string[] = [];
		for (const key in AudioFilters.filters) {
			list.push(key);
		}
		return list;
	}

	static async search(
		interaction: Interaction,
		query: string,
		source: string = 'auto',
	): Promise<SearchResult> {
		return await PlayerService._player.search(query, {
			requestedBy: interaction.user,
			searchEngine: `${source}Search` as any,
		});
	}

	static async play(
		interaction: Interaction,
		query: string | SearchResult,
		source: string = 'auto',
		type: string = 'song',
	): Promise<{ track: Track }> {
		const channel = (interaction.member as GuildMember).voice.channel;
		if (!channel) throw new Error('Voice channel not found');
		return await PlayerService._player.play(channel, query, {
			searchEngine: `${source}Search` as any,
			nodeOptions: {
				metadata: {
					type,
					channel: interaction.channel,
					guildId: interaction.guild?.id,
					client: interaction.guild?.members.me,
					requestedBy: interaction.user.username,
				},
				selfDeaf: true,
				leaveOnEmptyCooldown: 300000,
				leaveOnEmpty: false,
				leaveOnEnd: false,
				leaveOnStop: false,
				bufferingTimeout: 0,
				volume: 100,
			},
		});
	}

	static async playVC(
		vc: VoiceChannel,
		guild: Guild,
		query: string | SearchResult,
		source: string = 'auto',
		type: string = 'song',
	): Promise<{ track: Track }> {
		const channel = vc;
		if (!channel) throw new Error('Voice channel not found');
		return await PlayerService._player.play(channel, query, {
			searchEngine: `${source}Search` as any,
			nodeOptions: {
				metadata: {
					type,
					guildId: guild?.id,
				},
				selfDeaf: true,
				leaveOnEmptyCooldown: 300000,
				leaveOnEmpty: false,
				leaveOnEnd: false,
				leaveOnStop: false,
				bufferingTimeout: 0,
				volume: 100,
			},
		});
	}

	static async playSoundEffect(
		interaction: Interaction,
		query: string | SearchResult,
	): Promise<{ track: Track }> {
		const channel = (interaction.member as GuildMember).voice.channel;
		if (!channel) throw new Error('Voice channel not found');
		if (this.isPlaying(interaction.guild?.id))
			throw new Error('Player is currently used');
		return await PlayerService.play(
			interaction,
			query,
			'youtube',
			'sound-effect',
		);
	}

	static async playSoundEffectVC(
		vc: VoiceChannel,
		guild: Guild,
		query: string | SearchResult,
	): Promise<{ track: Track }> {
		const channel = vc;
		if (!channel) throw new Error('Voice channel not found');
		if (this.isPlaying(guild.id))
			throw new Error('Player is currently used');
		return await PlayerService.playVC(
			vc,
			guild,
			query,
			'youtube',
			'sound-effect',
		);
	}

	static async searchAndPlay(
		interaction: Interaction,
		query: string,
		source: string = 'auto',
	): Promise<{ track: Track }> {
		let _query: any = query;
		if (!REGEX_LINK.exec(query)) {
			_query = await PlayerService.search(interaction, _query, source);
		}
		return await PlayerService.play(interaction, _query);
	}

	static togglePause(guild: Guild): void {
		const queue = PlayerService._player.nodes.get(guild.id);
		queue?.node.setPaused(!queue.node.isPaused());
	}

	private static isPlaying(guildId?: string): boolean {
		if (!guildId) return true;
		const queue = PlayerService._player.nodes.get(guildId);
		return queue?.isPlaying() ?? false;
	}

	private static stopByID(guildId: string): void {
		const queue = PlayerService._player.nodes.get(guildId);
		queue?.node.stop();
		queue?.delete();
	}

	static stop(guild: Guild): void {
		const queue = PlayerService._player.nodes.get(guild.id);
		queue?.node.stop();
		queue?.delete();
		PlayerService.removeTrackMessage(guild.id);
	}

	static skip(guild: Guild): void {
		const queue = PlayerService._player.nodes.get(guild.id);
		queue?.node.skip();
	}

	static async setVolume(guild: Guild, volume: number): Promise<void> {
		const queue = PlayerService._player.nodes.get(guild.id);
		queue?.node.setVolume(volume);
		await queue?.channel?.send(`🔊 Volume set to **${volume}**`);
	}

	static async volumeDown(guild: Guild): Promise<void> {
		const queue = PlayerService._player.nodes.get(guild.id);
		if (queue) {
			const volume = queue.node.volume - 10;
			if (volume >= 0) {
				queue.node.setVolume(volume);
				await queue?.channel?.send(`🔊 Volume set to **${volume}**`);
			}
			else {
				queue.node.setVolume(0);
				await queue.channel?.send('🔊 Volume set to **0**');
			}
		}
	}

	static async volumeUp(guild: Guild): Promise<void> {
		const queue = PlayerService._player.nodes.get(guild.id);
		if (queue) {
			const volume = queue.node.volume + 10;
			if (volume <= 100) {
				queue.node.setVolume(volume);
				await queue?.channel?.send(`🔊 Volume set to **${volume}**`);
			}
			else {
				queue.node.setVolume(100);
				await queue.channel?.send('🔊 Volume set to **100**');
			}
		}
	}

	static isEnabledFilter(guild: Guild, filter: string): boolean {
		const queue = PlayerService._player.nodes.get(guild.id);

		const isValid = PlayerService.filters.includes(filter);

		if (queue && isValid) {
			return queue.filters.ffmpeg.filters.includes(filter as any);
		}
		return false;
	}

	static async enableFilter(guild: Guild, filter: string): Promise<void> {
		const queue = PlayerService._player.nodes.get(guild.id);

		const isValid = PlayerService.filters.includes(filter);

		if (queue && isValid) {
			queue.filters.ffmpeg.setFilters([filter as any]);
			await queue?.channel?.send({
				content: `🔊 Filter **${filter}** enabled`,
				flags: [4096],
			});
		}
		else if (queue && filter === 'none') {
			queue.filters.ffmpeg.setFilters([]);
			await queue?.channel?.send({
				content: '🔊 Filter disabled',
				flags: [4096],
			});
		}
	}

	static autocompletionsFilters(guild: Guild, filters: string[]): any[] {
		const _filters = filters
			.map((filter) => {
				const isEnabled = PlayerService.isEnabledFilter(guild, filter);
				return {
					name: `${isEnabled ? '🟢' : '🔴'} | ${filter}`,
					value: filter,
				};
			})
			.sort((a, b) => SortUtils.byStartsWith(a.name, b.name, '🟩'));
		_filters.unshift({
			name: '⚪ | none',
			value: 'none',
		});
		return _filters;
	}
}
