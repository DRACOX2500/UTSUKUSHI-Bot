import { type HydratedDocument } from 'mongoose';
import { type Guild, type SoundEffect, type User } from '../../types/business';
import { SoundEffectModel } from '../../database/schemas/sound-effect.schema';

export class SoundEffectService {

	async save(value: SoundEffect): Promise<HydratedDocument<SoundEffect>> {
		const _se = new SoundEffectModel(value);
		return await _se.save();
	}

	async getOrCreate(se: SoundEffect, guild?: HydratedDocument<Guild>): Promise<SoundEffect> {
		const doc = await this.get(se.url, guild);
		if (doc) return doc;
		else {
			se.guild = guild;
			const query = await this.save(se);
			return await (query?.toObject() ?? null);
		};
	}

	async getDoc(url: string, guild?: HydratedDocument<Guild>): Promise<HydratedDocument<SoundEffect> | null> {
		let search: any = { url };
		if (guild) search = { url, guild: guild._id };
		return await SoundEffectModel.findOne(search).exec();
	}

	async get(url: string, guild?: HydratedDocument<Guild>): Promise<SoundEffect | null> {
		let search: any = { url };
		if (guild) search = { url, guild: guild._id };
		const query = await SoundEffectModel.findOne(search).exec();
		return await (query?.toObject() ?? null);
	}

	async getAllPublic(): Promise<SoundEffect[]> {
		return await SoundEffectModel.find({ guild: undefined }).exec();
	}

	async getAllByGuild(guild: HydratedDocument<Guild>): Promise<SoundEffect[]> {
		return await SoundEffectModel.find({ guild: guild._id }).exec();
	}

	async getAllByUser(user: HydratedDocument<User>): Promise<SoundEffect[]> {
		return await SoundEffectModel.find({ user: user._id }).exec();
	}

	async remove(url: string, user?: HydratedDocument<User>): Promise<void> {
		let search: any = { url };
		if (user) search = { url, user: user._id };
		await SoundEffectModel.deleteOne(search).exec();
	}

	async removeByGuild(guild: HydratedDocument<Guild>): Promise<void> {
		await SoundEffectModel.deleteMany({ guild: guild._id }).exec();
	}

	async removeByUser(user: HydratedDocument<User>): Promise<void> {
		await SoundEffectModel.deleteMany({ user: user._id }).exec();
	}
}