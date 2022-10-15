import { User } from 'discord.js';
import {
	BotUserData,
	BotCacheGlobalGuildEmoji,
} from '@models/firebase/document-data.model';
import { sortByName } from '@utils/sortByName';
import { BotFirebase } from './firebase';
export class FirebaseCache {
	readonly userdata!: Map<string, BotUserData>;
	readonly emojiCache!: BotCacheGlobalGuildEmoji[];

	constructor(private firebase: BotFirebase) {
		this.userdata = new Map();
		this.emojiCache = [];
		this.fetchEmojis();

		// 1 min interval -> clear cache
		setInterval(() => this.userdata.clear(), 60000);
	}

	async fetchEmojis(): Promise<BotCacheGlobalGuildEmoji[]> {
		const data = await this.firebase.getCacheGlobalEmoji();
		if (!data) return [];
		data.sort((a, b) => sortByName(a.name ?? '', b.name ?? ''));

		this.emojiCache.splice(0, this.emojiCache.length);
		this.emojiCache.push(...data);
		return this.emojiCache;
	}

	add(user: User, data: BotUserData) {
		this.userdata.set(user.id, data);
	}

	clean(user: User) {
		this.userdata.delete(user.id);
	}
}
