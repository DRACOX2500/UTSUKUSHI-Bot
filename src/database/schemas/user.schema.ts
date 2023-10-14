import { Schema, model } from 'mongoose';
import { type User } from '../../types/business';
import { SCHEMAS } from '../../database/database';

const userSchema = new Schema<User>({
	id: {
		type: String,
		require: true,
		unique: true,
	},
	songs: {
		type: {
			enabled: Boolean,
			list: {
				type: [{
					item: {
						type: Schema.Types.ObjectId,
						ref: SCHEMAS.SONG,
						required: true,
					},
					date: {
						type: Date,
						required: true,
					},
				}],
				require: true,
				default: [],
			},
		},
		default: {
			list: [],
		},
	},
	anthem: {
		type: Schema.Types.ObjectId,
		ref: SCHEMAS.SOUND_EFFECT,
	},
});

export const UserModel = model<User>(SCHEMAS.USER, userSchema);