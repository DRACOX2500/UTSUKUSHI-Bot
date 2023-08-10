import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";


const soundEffectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
})

export = model(SCHEMAS.SOUND_EFFECT, soundEffectSchema);