import { HydratedDocument } from "mongoose";
import { SongModel } from "../../database/schemas/song.schema";
import { Song } from "../../types/business";
import { UtsukushiBotClient } from "../../bot/client";
import { ChatInputCommandInteraction } from "discord.js";
import { Track } from "discord-player";

export class SongService {

    async save(value: Song): Promise<HydratedDocument<Song>> {
        const _song = new SongModel(value);
        return _song.save();
    }

    async getOrCreate(song: Song): Promise<HydratedDocument<Song>> {
        const doc = await SongModel.findOne({ url: song.url }).exec();
        if (doc) return doc;
        else return this.save(song);
    }

    static async saveTrack(track: Track, client: UtsukushiBotClient, interaction: ChatInputCommandInteraction) {
        const song = {
            title: track.title,
            url: track.url,
        };
        await client.store.users.addSong(interaction.user, song);
        await client.store.guilds.updateLastTrack(interaction.guild as any, song);
    }
}