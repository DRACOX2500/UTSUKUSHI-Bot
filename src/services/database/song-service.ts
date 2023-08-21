import { HydratedDocument } from "mongoose";
import { SongModel } from "../../database/schemas/song.schema";
import { Song } from "../../types/business";

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
}