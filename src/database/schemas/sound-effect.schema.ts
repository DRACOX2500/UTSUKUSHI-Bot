import { Schema, model } from "mongoose";
import { SoundEffect } from "@/types/business";
import { SCHEMAS } from "@/database/database";

const soundEffectSchema = new Schema<SoundEffect>({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
})

export const SoundEffectModel = model<SoundEffect>(SCHEMAS.SOUND_EFFECT, soundEffectSchema);