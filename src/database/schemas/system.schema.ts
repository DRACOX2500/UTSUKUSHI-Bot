import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";

const systemSchema = new Schema({
    emojis: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: SCHEMAS.EMOJI
        }],
        default: [],
    },
    soundEffects: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: SCHEMAS.SOUND_EFFECT
        }],
        default: [],
    },
    activity: {
        status: String,
        code: Number,
        url: String,
    },
    status: String,
})

export = model(SCHEMAS.SYSTEM, systemSchema);