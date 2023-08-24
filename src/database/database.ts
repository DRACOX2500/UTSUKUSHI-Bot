import { type UtsukushiBotClient } from '../bot/client';
import { BOT_EVENTS } from '../constants';
import logger from '../core/logger';
import { environment } from '../environment';
import mongoose from 'mongoose';

export function connectMongoDB(client: UtsukushiBotClient): void {
	mongoose.set('strictQuery', true);
	mongoose.connect(environment.DB_URL)
		.then(() => {
			logger.botConnectedDB();
			client.emit(BOT_EVENTS.DATABASE_CONNECTED);
		})
		.catch(error => { logger.error('DATABASE', error); });
}

export const SCHEMAS = {
	EMOJI: 'Emoji',
	GUILD: 'Guild',
	SOUND_EFFECT: 'SoundEffect',
	SONG: 'Song',
	SYSTEM: 'System',
	USER: 'User',
};