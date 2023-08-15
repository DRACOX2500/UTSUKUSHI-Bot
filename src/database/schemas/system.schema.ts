import { Schema, model } from "mongoose";
import { UtsukushiSystem } from "@/types/business";
import { SCHEMAS } from "@/database/database";

const systemSchema = new Schema<UtsukushiSystem>({
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

export const SystemModel = model<UtsukushiSystem>(SCHEMAS.SYSTEM, systemSchema);