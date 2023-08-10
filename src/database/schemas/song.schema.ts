import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";

const songSchema = new Schema({
    url: {
        type: String,
        require: true,
        unique: true,
    },
    title: String,
})

export = model(SCHEMAS.SONG, songSchema);