import { Schema, model } from 'mongoose';
import { type Emoji } from '../../types/business';
import { SCHEMAS } from '../../database/database';

const emojiSchema = new Schema<Emoji>({
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
	},
});

export const EmojiModel = model<Emoji>(SCHEMAS.EMOJI, emojiSchema);