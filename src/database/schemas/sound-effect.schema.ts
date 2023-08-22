import { Schema, model } from "mongoose";
import { SoundEffect } from '../../types/business';
import { SCHEMAS } from "../../database/database";

const soundEffectSchema = new Schema<SoundEffect>({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: SCHEMAS.USER,
        required: true,
    },
    guild: {
        type: Schema.Types.ObjectId,
        ref: SCHEMAS.GUILD
    }
})

export const SoundEffectModel = model<SoundEffect>(SCHEMAS.SOUND_EFFECT, soundEffectSchema);