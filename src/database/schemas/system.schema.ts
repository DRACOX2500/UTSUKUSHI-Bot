import { Document, Model, Schema, model } from "mongoose";
import { SCHEMAS } from "../database";
import { UtsukushiSystem } from "@/types/business";


type SystemDocType = Document<any, any, UtsukushiSystem>;

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