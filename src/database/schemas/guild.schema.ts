import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";

const guildSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true,
    },
    name: {
        type: String,
        require: true,
    },
    emojisShared: {
        type: Boolean,
        default: false,
        require: true,
    },
    vocalNotifyChannel: String,
    lastPlay: {
        type: Schema.Types.ObjectId,
        ref: SCHEMAS.SONG
    },
    soundEffects: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: SCHEMAS.SOUND_EFFECT
        }],
        default: [],
    },
})

export = model(SCHEMAS.GUILD, guildSchema);