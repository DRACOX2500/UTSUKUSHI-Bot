import { type Guild as GuildDJS, type GuildEmoji } from 'discord.js';
import { type Emoji, type Guild, type Song, type SoundEffect, type User } from '../../types/business';
import { GuildModel } from '../../database/schemas/guild.schema';
import { EmojiModel } from '../../database/schemas/emoji.schema';
import { SongService } from '../database/song-service';
import { SoundEffectService } from '../database/sound-effect-service';
import { type HydratedDocument } from 'mongoose';
import { AbstractRecordDocStore } from './abstract-record-doc-store';

export class GuildStore extends AbstractRecordDocStore<Guild> {

	private readonly songService: SongService;
	private readonly soundEffectService: SoundEffectService;

	constructor() {
		super(GuildModel, 'guilds-cache');
		this.songService = new SongService();
		this.soundEffectService = new SoundEffectService();
	}

	override async update(id: string, value: Partial<Guild>): Promise<Guild | null> {
		return await this.updateItem(id, value, ['lastPlay']);
	}

	async removeItemByGuild(guild: GuildDJS): Promise<HydratedDocument<Guild> | null> {
		const doc = await super.removeItem(guild.id);
		if (doc) {
			await this.removeAllEmojis(guild);
			await this.soundEffectService.removeByGuild(doc);
		}
		return doc;
	}

	async updateNotify(guild: GuildDJS, notifyChannelId: string | null): Promise<void> {
		await this.update(
			guild.id,
			{
				vocalNotifyChannel: notifyChannelId,
			},
		);
	}

	async getOrAddItemByGuild(guild: GuildDJS): Promise<Guild> {
		const value: Guild = {
			id: guild.id,
			emojisShared: false,
		};
		return await this.getOrAddItem(value);
	}

	async getOrAddDocByGuild(guild: GuildDJS): Promise<HydratedDocument<Guild>> {
		const _guild = await this.getOrAddItemByGuild(guild);
		return this.getDocById(_guild.id) as any;
	}

	async updateLastTrack(guild: GuildDJS, song: Song): Promise<void> {
		const doc = await this.getOrAddItemByGuild(guild);

		if (this.isLastTrack(doc, song)) return;

		const _song = await this.songService.getOrCreate(song);
		await this.update(
			doc.id,
			{
				lastPlay: _song,
			},
		);
	}

	isLastTrack(guild: Guild, song: Song): boolean {
		return guild.lastPlay?.url === song.url;
	}

	async getEmojis(guild: GuildDJS): Promise<Emoji[]> {
		const _guild = await this.getItem(guild.id);
		const emojis: Array<Emoji | GuildEmoji> = await this.getSharedEmojis();
		if (!_guild?.emojisShared) {
			const emojisGuild = await guild.emojis.fetch();
			emojis.push(
				...emojisGuild.map(_emoji => _emoji),
			);
		}
		return emojis.map((_emoji): Emoji => ({
			id: _emoji.id,
			name: _emoji.name ?? '',
			animated: _emoji.animated ?? false,
		}));
	}

	async enableSharedEmojis(guild: GuildDJS): Promise<void> {
		const doc = await this.getOrAddItemByGuild(guild);
		const updoc = await this.update(
			doc.id,
			{
				emojisShared: true,
			},
		);
		if (updoc) await this.addAllEmojis(guild);
	}

	async getSharedEmojis(): Promise<Emoji[]> {
		return await EmojiModel.find().exec();
	}

	async disableSharedEmojis(guild: GuildDJS): Promise<void> {
		const doc = await this.getOrAddItemByGuild(guild);
		const updoc = await this.update(
			doc.id,
			{
				emojisShared: false,
			},
		);
		if (updoc) await this.removeAllEmojis(guild);
	}

	async addAllEmojis(guild: GuildDJS): Promise<Emoji[]> {
		const emojis = await guild.emojis.fetch();
		const list = emojis.map(_emoji => _emoji);
		return await EmojiModel.insertMany(list, { ordered : false });
	}

	async removeAllEmojis(guild: GuildDJS): Promise<void> {
		const emojis = await guild.emojis.fetch();
		const list = emojis.map(_emoji => _emoji);
		await EmojiModel.deleteMany(list).exec();
	}

	async addEmoji(guild: GuildDJS, emoji: Emoji): Promise<Emoji | null> {
		const _guild = await this.getItem(guild.id);
		if (_guild?.emojisShared) {
			const doc = new EmojiModel(emoji);
			return await doc.save();
		}
		return null;
	}

	async updateEmoji(guild: GuildDJS, emojiId: string, emoji: Emoji): Promise<Emoji | null> {
		const _guild = await this.getItem(guild.id);
		if (_guild?.emojisShared) {
			const doc = await EmojiModel.findOne({ id: emojiId }).exec();
			if (!doc) return null;
			return await EmojiModel.findOneAndUpdate(
				{ id: doc.id },
				{
					...emoji,
				},
				{ new: true },
			)
				.exec();
		}
		return null;
	}

	async removeEmoji(guild: GuildDJS, emoji: Emoji): Promise<void> {
		const _guild = await this.getItem(guild.id);
		if (_guild?.emojisShared) {
			await EmojiModel.deleteOne({ id: emoji.id }).exec();
		}
	}

	async addSoundEffect(se: SoundEffect, guild?: GuildDJS): Promise<SoundEffect | null> {
		let _guild: HydratedDocument<Guild> | undefined;
		if (guild) _guild = await this.getOrAddDocByGuild(guild) ?? undefined;
		return await this.soundEffectService.getOrCreate(se, _guild);
	}

	async getSoundEffect(url: string): Promise<SoundEffect | null> {
		return await this.soundEffectService.get(url);
	}

	async getAllSoundEffects(guild?: GuildDJS): Promise<SoundEffect[]> {
		const selist = await this.soundEffectService.getAllPublic();
		if (guild) {
			const doc = await this.getDocById(guild.id);
			if (doc) {
				const guildSe = await this.soundEffectService.getAllByGuild(doc);
				selist.push(...guildSe);
			}
		}
		return selist;
	}

	async getAllSoundEffectsByUser(user: HydratedDocument<User>): Promise<SoundEffect[]> {
		return await this.soundEffectService.getAllByUser(user);
	}
}