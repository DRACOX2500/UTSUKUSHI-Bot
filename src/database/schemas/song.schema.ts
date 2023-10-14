import { Schema, model } from 'mongoose';
import { type Song } from '../../types/business';
import { SCHEMAS } from '../../database/database';

const songSchema = new Schema<Song>({
	url: {
		type: String,
		require: true,
		unique: true,
	},
	title: String,
	source: String,
});

export const SongModel = model<Song>(SCHEMAS.SONG, songSchema);