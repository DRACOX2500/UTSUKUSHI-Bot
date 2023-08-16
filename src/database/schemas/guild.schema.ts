import { Schema, model } from "mongoose";
import { Guild } from "@/types/business";
import { SCHEMAS } from "@/database/database";

export const GUILD_SCHEMA = 'Guild';

const guildSchema = new Schema<Guild>({
    id: {
        type: String,
        require: true,
        unique: true,
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

export const GuildModel = model<Guild>(SCHEMAS.GUILD, guildSchema);