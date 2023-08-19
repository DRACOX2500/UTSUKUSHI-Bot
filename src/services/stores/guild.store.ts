import { Guild as GuildDJS } from 'discord.js';
import { Emoji, Guild } from "@/types/business";
import { GuildModel } from "@/database/schemas/guild.schema";
import { AbstractRecordStore } from "./abstract-record-store";

export class GuildStore extends AbstractRecordStore<Guild> {

    constructor() {
        super(GuildModel, {});
    }

    override save(id: string, value: Guild): Guild {
        const _value: Guild = {
            id: value.id,
            emojisShared: value.emojisShared,
            soundEffects: value.soundEffects,
            vocalNotifyChannel: value.vocalNotifyChannel,
        }
        return super.save(id, _value);
    }

    private async getFromDB(guildId: string): Promise<Guild | null> {
        const doc = await GuildModel.findOne({ id: guildId }).exec();
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
        // TODO: get Shared Emojis or Guild emojis
        const emojisGuild = await guild.emojis.fetch();
        return emojisGuild.map((_emoji): Emoji => ({
            id: _emoji.id,
            name: _emoji.name ?? '',
            animated: _emoji.animated ?? false,
        }))
    }

    async updateNotify(guild: GuildDJS, notifyChannelId: string | null) {
        const doc = await this.getOrCreate(guild);
        const updoc = await GuildModel.findOneAndUpdate(
            { id: doc.id },
            {
                vocalNotifyChannel: notifyChannelId,
            },
            { new: true }
        )
        // .populate('emojis')
        // .populate('soundEffects')
        .exec();
        if (updoc) this.save(updoc.id, updoc);
    }

    async removeDoc(guild: GuildDJS) {
        await this.schema.deleteOne({ id: guild.id }).exec();
    }

    async addAllEmoji(guild: GuildDJS, emojis: Emoji[]) {
        //TODO: method
    }

    async removeAllEmoji(guild: GuildDJS) {
        //TODO: method
    }

    async addEmoji(guild: GuildDJS, emojis: Emoji) {
        //TODO: method
    }

    async updateEmoji(guild: GuildDJS, emojis: Emoji) {
        //TODO: method
    }

    async removeEmoji(guild: GuildDJS, emojis: Emoji) {
        //TODO: method
    }
}