import { Guild as GuildDJS } from 'discord.js';
import { Emoji, Guild } from "@/types/business";
import { GuildModel } from "@/database/schemas/guild.schema";
import { HydratedDocument } from "mongoose";
import { AbstractRecordStore } from "./abstract-record-store";

export class GuildStore extends AbstractRecordStore<Guild> {

    constructor() {
        super(GuildModel, {});
    }

    private async getFromDB(guildId: string): Promise<Guild | null> {
        const doc = await GuildModel.findOne({ id: guildId }).exec();
        if (doc) {
            this.save(doc.id, doc);
            return doc;
        }
        return null;
    }

    async create(guild: Guild): Promise<HydratedDocument<Guild>> {
        const doc = new GuildModel(guild);
        const saved = await doc.save();
        this.save(saved.id, saved);
        return saved;
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

    async updateNotify(guild: GuildDJS, notifyChannelId: string | null) {
        const doc = await this.getOrCreate(guild);
        const updoc = await GuildModel.findByIdAndUpdate(
            (doc as any)._id,
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