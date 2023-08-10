import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";

const userSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
    },
    songs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: SCHEMAS.SONG
        }],
        default: []
    }
})

export = model(SCHEMAS.USER, userSchema);