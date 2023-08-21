import { Guild as GuildDJS, GuildEmoji } from 'discord.js';
import { Emoji, Guild, Song } from "../../types/business";
import { GuildModel } from "../../database/schemas/guild.schema";
import { AbstractRecordStore } from "./abstract-record-store";
import { EmojiModel } from '../../database/schemas/emoji.schema';
import { SongService } from '../database/song-service';

export class GuildStore extends AbstractRecordStore<Guild> {

    private songService: SongService;

    constructor() {
        super(GuildModel, {});
        this.songService = new SongService();
    }

    override save(id: string, value: Guild): Guild {
        const _value: Guild = {
            id: value.id,
            emojisShared: value.emojisShared,
            soundEffects: value.soundEffects,
            vocalNotifyChannel: value.vocalNotifyChannel,
            lastPlay: value.lastPlay,
        }
        return super.save(id, _value);
    }

    private async getFromDB(guildId: string): Promise<Guild | null> {
        const doc = await GuildModel
            .findOne({ id: guildId })
            .populate('lastPlay')
            .exec();
        if (doc) return this.save(doc.id, doc);
        return null;
    }

    async create(guild: Guild): Promise<Guild> {
        const doc = new GuildModel(guild);
        const saved = await doc.save();
        return this.save(saved.id, saved);
    }

    async getOrCreate(guild: GuildDJS): Promise<Guild> {
        const doc = await this.get(guild.id);
        if (doc) return doc;
        else {
            const _save: Guild = {
                id: guild.id,
                emojisShared: false,
                soundEffects: [],
            };
            return this.create(_save);
        }
    }

    async get(guildId: string): Promise<Guild | null> {
        const guild = this.value[guildId];
        if (!guild)  return this.getFromDB(guildId);
        return guild;
    }

    async getEmojis(guild: GuildDJS): Promise<Emoji[]> {
        const _guild = await this.get(guild.id);
        const emojis: (Emoji | GuildEmoji)[] = await this.getSharedEmojis();
        if (!_guild?.emojisShared) {
            const emojisGuild = await guild.emojis.fetch();
            emojis.push(
                ...emojisGuild.map(_emoji => _emoji)
            );
        }
        return emojis.map((_emoji): Emoji => ({
            id: _emoji.id,
            name: _emoji.name ?? '',
            animated: _emoji.animated ?? false,
        }));
    }

    async update(guildId: string, guild: Partial<Guild>) {
        return GuildModel.findOneAndUpdate(
            { id: guildId },
            {
                ...guild,
            },
            { new: true }
        )
        .populate('lastPlay')
        // .populate('emojis')
        // .populate('soundEffects')
        .exec();
    }

    async updateNotify(guild: GuildDJS, notifyChannelId: string | null) {
        const doc = await this.getOrCreate(guild);
        const updoc = await this.update(
            doc.id,
            {
                vocalNotifyChannel: notifyChannelId,
            }
        );
        if (updoc) this.save(updoc.id, updoc);
    }

    isLastTrack(guild: Guild, song: Song) {
        return guild.lastPlay?.url === song.url;
    }

    async updateLastTrack(guild: GuildDJS, song: Song) {
        const doc = await this.getOrCreate(guild);

        if (this.isLastTrack(doc, song)) return;

        const _song = await this.songService.getOrCreate(song);
        const updoc = await this.update(
            doc.id,
            {
                lastPlay: _song,
            }
        );
        if (updoc) this.save(updoc.id, updoc);
    }

    async removeDoc(guild: GuildDJS) {
        await this.removeAllEmojis(guild);
        await this.schema.deleteOne({ id: guild.id }).exec();
    }

    async enableSharedEmojis(guild: GuildDJS) {
        const doc = await this.getOrCreate(guild);
        const updoc = await this.update(
            doc.id,
            {
                emojisShared: true,
            }
        );
        if (updoc) this.save(updoc.id, updoc);
        await this.addAllEmojis(guild);
    }

    async getSharedEmojis(): Promise<Emoji[]> {
        return EmojiModel.find().exec();
    }

    async disableSharedEmojis(guild: GuildDJS) {
        const doc = await this.getOrCreate(guild);
        const updoc = await this.update(
            doc.id,
            {
                emojisShared: false,
            }
        );
        if (updoc) this.save(updoc.id, updoc);
        await this.removeAllEmojis(guild);
    }

    async addAllEmojis(guild: GuildDJS): Promise<Emoji[]> {
        const emojis = await guild.emojis.fetch();
        const list = emojis.map(_emoji => _emoji);
        return EmojiModel.insertMany(list, { ordered : false });
    }

    async removeAllEmojis(guild: GuildDJS): Promise<void> {
        const emojis = await guild.emojis.fetch();
        const list = emojis.map(_emoji => _emoji);
        await EmojiModel.deleteMany(list).exec();
    }

    async addEmoji(guild: GuildDJS, emoji: Emoji): Promise<Emoji | null> {
        const _guild = await this.get(guild.id);
        if (_guild?.emojisShared) {
            const doc = new EmojiModel(emoji);
            return doc.save();
        }
        return null;
    }

    async updateEmoji(guild: GuildDJS, emojiId: string, emoji: Emoji): Promise<Emoji | null> {
        const _guild = await this.get(guild.id);
        if (_guild?.emojisShared) {
            const doc = await EmojiModel.findOne({ id: emojiId }).exec();
            if (!doc) return null;
            return EmojiModel.findOneAndUpdate(
                    { id: doc.id },
                    {
                        ...emoji,
                    },
                    { new: true }
                )
                .exec();
        }
        return null;
    }

    async removeEmoji(guild: GuildDJS, emoji: Emoji): Promise<void> {
        const _guild = await this.get(guild.id);
        if (_guild?.emojisShared) {
            await EmojiModel.deleteOne({ id: emoji.id }).exec();
        }
    }
}