import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";
import { BotActivity } from "@/core/types/business";

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


systemSchema.methods.updateActivity = async function(activity: BotActivity) {

}

systemSchema.statics.findFirst = async function() {
    return this.find({}, { limit: 1 })[0] ?? null;
}

export = model(SCHEMAS.SYSTEM, systemSchema);