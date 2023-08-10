import { Schema, model } from "mongoose";
import { SCHEMAS } from "../database";


const emojiSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    animated: {
        type: Boolean,
        default: false,
        required: true,
    }
})

export = model(SCHEMAS.EMOJI, emojiSchema);