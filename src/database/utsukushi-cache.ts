/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	GlobalData,
	GlobalDataEmoji,
	GlobalDataSoundEffect,
	GuildData,
	UserData,
} from '@models/firebase/document-data.model';
import { CLEANER_TIMEOUT } from 'src/constant';
import { UtsukushiFirebase } from './firebase';

type DatedObject<T> = {value: T, date: number};

class Timeout {
	private timer: NodeJS.Timer | null = null;
	private callback!: (() => void);
	private ms!: number;

	set(callback: () => void, ms: number): void {
		this.callback = callback;
		this.ms = ms;
		this.timer = setInterval(callback, ms);
	}

	cancel(): void {
		clearInterval(this.timer?.ref());
		this.timer = null;
	}

	reset(): void {
		this.cancel();
		this.set(this.callback, this.ms);
	}
}

class UserCache {

	private cache: Map<string, DatedObject<UserData>> = new Map();
	private cleaner = new Timeout();

	constructor(private firebase: UtsukushiFirebase.UtsukushiFirestore, private timeout = 600000) {
		this.cleaner.set(() => {
			if (this.cache.size < 50) return;
			const now = Date.now();
			this.cache.forEach((value, key) => {
				if (now - value.date > CLEANER_TIMEOUT) {
					this.cache.delete(key);
				}
			});
		}
		, this.timeout);
	}
	get(): Map<string, DatedObject<UserData>> {
		return this.cache;
	}
	async getByKey(key: string):Promise<DatedObject<UserData> | null> {
		const data = this.cache.get(key);
		if (data) return data;
		return this.fetchByKey(key);
	}
	set(key:string, value:UserData):void {
		const map = this.cache.get(key);
		if (map) value.keywords = map.value.keywords.concat(value.keywords);
		this.cache.set(key, { value: value, date: Date.now() });
		this.firebase.collections.user.set(key, value);
		this.cleaner.reset();
	}
	async fetchByKey(key:string): Promise<DatedObject<UserData>|null> {
		const data = await this.firebase.collections.user.get(key);
		if (!data) return null;
		this.set(key, data);
		return { value: data, date: Date.now() };
	}
	clear(key:string):void {
		this.cache.delete(key);
	}
	async reset(key:string):Promise<boolean> {
		const res = await this.firebase.collections.user.reset(key);
		if (res) {
			this.clear(key);
			return true;
		}
		return false;
	}
}

class GuildCache {

	private cache: Map<string, DatedObject<GuildData>> = new Map();
	private cleaner = new Timeout();

	constructor(private firebase: UtsukushiFirebase.UtsukushiFirestore, private timeout = 600000) {
		this.cleaner.set(() => {
			if (this.cache.size < 50) return;
			const now = Date.now();
			this.cache.forEach((value, key) => {
				if (now - value.date > CLEANER_TIMEOUT) {
					this.cache.delete(key);
				}
			});
		}
		, this.timeout);
	}

	get(): Map<string, DatedObject<GuildData>> {
		return this.cache;
	}
	async getByKey(key: string):Promise<DatedObject<GuildData> | null> {
		const data = this.cache.get(key);
		if (data) return data;
		return this.fetchByKey(key);
	}
	set(key:string, value:GuildData):void {
		this.cache.set(key, { value: value, date: Date.now() });
		this.firebase.collections.guild.set(key, value);
		this.cleaner.reset();
	}
	async fetchByKey(key:string): Promise<DatedObject<GuildData>|null> {
		const data = await this.firebase.collections.guild.get(key);
		if (!data) return null;
		this.set(key, data);
		return { value: data, date: Date.now() };
	}
	clear(key:string):void {
		this.cache.delete(key);
	}
	async reset(key:string):Promise<boolean> {
		const res = await this.firebase.collections.guild.reset(key);
		if (res) {
			this.clear(key);
			return true;
		}
		return false;
	}
}

class GlobalCache {
	private data!: GlobalData;
	private soundeffects!: GlobalDataSoundEffect[];
	private emojis!: GlobalDataEmoji[];

	constructor(private firebase: UtsukushiFirebase.UtsukushiFirestore) {
		this.fetchEmojis();
		this.fetchSoundEffects();
	}

	setData(data:GlobalData) : void {
		this.firebase.collections.global.set(data);
		this.data = data;
	}

	getData() {
		return this.data;
	}

	async fetchData(): Promise<GlobalData> {
		const data = await this.firebase.collections.global.get();
		if (!data) return {};
		this.data = data;
		return data;
	}

	setSoundEffects(effects:GlobalDataSoundEffect[]) {
		this.firebase.collections.global.soundEffects.set(effects);
		this.soundeffects = effects;
	}

	getSoundEffects(): GlobalDataSoundEffect[] {
		return this.soundeffects;
	}

	async fetchSoundEffects(): Promise<GlobalDataSoundEffect[]> {
		const data = await this.firebase.collections.global.soundEffects.get();
		if (!data) return [];
		this.soundeffects = data;
		return data;
	}

	async setEmojis(emojis: GlobalDataEmoji[]): Promise<boolean> {
		const res = await this.firebase.collections.global.emojis.set(...emojis);
		if (!res) return false;
		this.emojis = emojis;
		return res;
	}

	getEmojis() {
		return this.emojis;
	}

	async deleteEmojis(emojis: GlobalDataEmoji[]): Promise<boolean> {
		const res = await this.firebase.collections.global.emojis.delete(...emojis);
		if (!res) return false;
		this.emojis = this.emojis.filter(val => !emojis.includes(val));
		return res;
	}

	async fetchEmojis(): Promise<GlobalDataEmoji[]> {
		const data = await this.firebase.collections.global.emojis.get();
		if (!data) return [];
		this.emojis = data;
		return data;
	}
}

export class UtsukushiCache {
	readonly users!: UserCache;
	readonly guilds!: GuildCache;
	readonly global!: GlobalCache;

	tempory: Map<string, any>;

	constructor(private firebase: UtsukushiFirebase.UtsukushiFirestore) {
		this.users = new UserCache(firebase);
		this.guilds = new GuildCache(firebase);
		this.global = new GlobalCache(firebase);

		this.tempory = new Map();
	}
}
