import { Schema, model } from "mongoose";
import { Song } from "@/types/business";
import { SCHEMAS } from "@/database/database";

const songSchema = new Schema<Song>({
    url: {
        type: String,
        require: true,
        unique: true,
    },
    title: String,
})

export const SongModel = model<Song>(SCHEMAS.SONG, songSchema);