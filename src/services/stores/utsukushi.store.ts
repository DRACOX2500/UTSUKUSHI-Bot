import { type UtsukushiSystem } from '../../types/business';
import { UserStore } from './user.store';
import { GuildStore } from './guild.store';
import { SystemModel } from '../../database/schemas/system.schema';
import { BOT_EVENTS, DEFAULT_SYSTEM } from '../../constants';
import { type BotActivity } from '../../core/types/business';
import { type PresenceStatusData } from 'discord.js';
import { type UtsukushiBotClient } from '../../bot/client';
import { AbstractStore } from './abstract-store';
import { type Model } from 'mongoose';

export class UtsukushiStore extends AbstractStore<UtsukushiSystem> {

	readonly users: UserStore;
	readonly guilds: GuildStore;

	readonly clipboard: Record<string, any> ;

	private readonly schema: Model<UtsukushiSystem>;

	constructor() {
		super(DEFAULT_SYSTEM);
		this.schema = SystemModel;
		this.clipboard = {};
		this.users = new UserStore();
		this.guilds = new GuildStore();
	}

	private async initDefault(): Promise<void> {
		const systDoc = new SystemModel(this.value);
		await systDoc.save();
	}

	async initialize(client: UtsukushiBotClient): Promise<void> {
		const res = await this.schema.find().limit(1).exec();
		if (res.length === 0) await this.initDefault();
		await super.set(res[0] ?? this.value);
		client.emit(BOT_EVENTS.STORE_INIT);
	}

	async updateActivity(activity: BotActivity): Promise<void> {
		const doc: any = await this.schema.find().limit(1).exec();
		const updoc = await SystemModel.findByIdAndUpdate(
			doc._id,
			{
				activity,
			},
			{ new: true },
		).exec();
		if (updoc) await super.set(updoc.toObject());
	}

	async updateStatus(status: PresenceStatusData): Promise<void> {
		const doc: any = await this.schema.find().limit(1).exec();
		const updoc = await SystemModel.findByIdAndUpdate(
			doc._id,
			{
				status,
			},
			{ new: true },
		).exec();
		if (updoc) await super.set(updoc.toObject());
	}

	get system(): UtsukushiSystem {
		return this.value;
	}
}