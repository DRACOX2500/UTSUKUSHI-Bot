import { botConnectedDB, logger } from "@/core/logger";
import { environment } from "@/environment";
import mongoose from "mongoose";

export function connectMongoDB(): void {
    mongoose.set("strictQuery", true);
    mongoose.connect(environment.DB_URL, { autoCreate: true })
        .then(() => botConnectedDB())
        .catch(error => logger.error(error));
}

export const SCHEMAS = {
    EMOJI: 'Emoji',
    GUILD: 'Guild',
    SOUND_EFFECT: 'SoundEffect',
    SONG: 'Song',
    SYSTEM: 'System',
    USER: 'User',
}