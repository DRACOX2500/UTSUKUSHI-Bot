/* eslint-disable @typescript-eslint/no-explicit-any */
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
	doc,
	Firestore,
	getDoc,
	getFirestore,
	setDoc,
	updateDoc,
	arrayUnion,
	deleteField,
	arrayRemove,
} from 'firebase/firestore';
import {
	Auth,
	getAuth,
	signInWithEmailAndPassword,
	User,
	UserCredential,
} from 'firebase/auth';
import { Guild, User as DiscordUser } from 'discord.js';
import { BotCacheGlobal, BotCacheGlobalGuildEmoji, BotCacheGlobalSoundEffect, BotCacheGuild, initBotCacheGuild } from '@models/database/BotCache';
import {
	BotUserData,
	BotUserDataTypes,
	initBotUserData,
} from '@models/database/BotUserData';
import { green, red } from 'ansicolor';
import { UtsukushiFirebaseGlobalEmoji } from '@models/database/Firebase.model';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const NOT_FOUND_ERROR = 'not-found';

class FirebaseCache {
	readonly userdata!: Map<string, BotUserData>;

	constructor() {
		this.userdata = new Map();

		// 1 min interval -> clear cache
		setInterval(() => this.userdata.clear(), 60000);
	}

	add(user: DiscordUser, data: BotUserData) {
		this.userdata.set(user.id, data);
	}

	clean(user: DiscordUser) {
		this.userdata.delete(user.id);
	}
}

export interface FirebaseAuth {
	email: string;
	password: string;
}

export class BotFirebase {
	// Your web app's Firebase configuration
	private firebaseConfig = {
		apiKey: '',
		authDomain: 'utsukushi-database.firebaseapp.com',
		projectId: 'utsukushi-database',
		storageBucket: 'utsukushi-database.appspot.com',
		messagingSenderId: '695089030418',
		appId: '1:695089030418:web:1c628025fa4d37ae7a3fcb',
	};

	private app!: FirebaseApp;
	private auth!: Auth;
	private user!: User;
	private db!: Firestore;

	userDataCache = new FirebaseCache();

	constructor(key: string, firebaseAuth: FirebaseAuth, test: boolean) {
		this.firebaseConfig.apiKey = key;

		// Initialize Firebase
		this.app = initializeApp(this.firebaseConfig);
		this.auth = getAuth();
		signInWithEmailAndPassword(
			this.auth,
			firebaseAuth.email,
			firebaseAuth.password
		)
			.then((userCredential: UserCredential) => {
				this.user = userCredential.user;
				if (!test) console.log(green('Connect to Firebase !'));
			})
			.catch((error) => {
				console.error(error);
			});

		this.db = getFirestore();
	}

	/**
	 * Default set Utsukushi Document
	 */
	async setCacheGlobal(cache: BotCacheGlobal): Promise<void> {
		const document = doc(this.db, 'global/utsukushi');

		setDoc(document, cache, { merge: true })
			.then(() => {
				console.log(green('[Cache Global] : Cache Saved Success !'));
			})
			.catch(() => {
				console.error(red('[Cache Global] : Cache Saved Failure !'));
			});
	}

	async setCacheGlobalSoundEffect(cache: BotCacheGlobalSoundEffect): Promise<void> {
		const document = doc(this.db, 'global/sound-effect');

		if (cache) {
			updateDoc(document, 'soundEffects', arrayUnion(cache))
				.then(() => {
					console.log(
						green('[Cache Global SoundEffect] : Updated Success !')
					);
				})
				.catch((error) => {
					console.error(
						red('[Cache Global SoundEffect] : Updated Failure !')
					);
					if (error.code === NOT_FOUND_ERROR) {
						console.log('[Cache Global SoundEffect] : Try to create doc...');
						setDoc(document, cache)
							.then(() => console.log(green('[Cache Global SoundEffect] : Success !')))
							.catch(() =>
								console.log(red('[Cache Global SoundEffect] : Failed !'))
							);
					}
				});
		}
		else {
			console.error(red('[Cache Global SoundEffect] : Updated Failure !'));
		}
	}

	async setCacheGlobalEmoji(...cache: BotCacheGlobalGuildEmoji[]): Promise<void> {
		const document = doc(this.db, 'global/emoji');
		console.log(cache);
		if (cache) {
			updateDoc(document, 'emojis', arrayUnion(...cache))
				.then(() => {
					console.log(
						green('[Cache Global Emoji] : Updated Success !')
					);
				})
				.catch((error) => {
					console.error(
						red('[Cache Global Emoji] : Updated Failure !')
					);
					if (error.code === NOT_FOUND_ERROR) {
						console.log('[Cache Global Emoji] : Try to create doc...');
						setDoc(document, { emojis: cache })
							.then(() => console.log(green('[Cache Global Emoji] : Success !')))
							.catch(() =>
								console.log(red('[Cache Global Emoji] : Failed !'))
							);
					}
				});
		}
	}

	async deleteCacheGlobalEmoji(...cache: BotCacheGlobalGuildEmoji[]): Promise<void> {

		if (cache) {
			cache.forEach((emoji) => {

				const document = doc(this.db, 'global/emoji/emojis/' + emoji.id);

				updateDoc(document, 'emojis', arrayRemove(...cache))
					.then(() => {
						console.log(green('[DELETE Emoji] Code Field has been deleted successfully'));
					})
					.catch(() => {
						console.log(red('[DELETE Emoji] : Failed !'));
					});
			});
		}
	}

	async setCacheByGuild(guild: Guild, cache: BotCacheGuild): Promise<void> {
		const document = doc(this.db, 'guild-data/' + guild.id);
		setDoc(document, cache, { merge: true })
			.then(() => {
				console.log(green(`[Cache ${guild.id}] : Cache Saved Success !`));
			})
			.catch(() => {
				console.error(red(`[Cache ${guild.id}] : Cache Saved Failure !`));
			});
	}

	async setUserData(user: DiscordUser, cache: BotUserDataTypes): Promise<void> {
		const document = doc(this.db, 'user-data/' + user.id);

		if (cache.keyword) {
			updateDoc(document, 'keywords', arrayUnion(cache.keyword))
				.then(() => {
					console.log(
						green('[UserData ' + user.id + '] : UserData Updated Success !')
					);
				})
				.catch((error) => {
					console.error(
						red('[UserData ' + user.id + '] : UserData Updated Failure !')
					);
					if (error.code === NOT_FOUND_ERROR) {
						console.log('[UserData ' + user.id + '] : Try to create doc...');
						setDoc(document, { keywords: [cache.keyword] })
							.then(() => console.log(green('[UserData ' + user.id + '] : Success !')))
							.catch(() =>
								console.log(red('[UserData ' + user.id + '] : Failed !'))
							);
					}
				});
			this.userDataCache.userdata.delete(user.id);
		}
		else {
			setDoc(document, cache, { merge: true })
				.then(() => {
					console.log(green('[Cache ' + user.id + '] : Cache Saved Success !'));
				})
				.catch(() => {
					console.error(red('[Cache ' + user.id + '] : Cache Saved Failure !'));
				});
		}
	}

	async getCacheGlobal(): Promise<BotCacheGlobal | null> {
		const document = doc(this.db, 'global/utsukushi');
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGlobal>caches.data();
		else console.error(red('[Cache Global] : Cache Not Found !'));
		return null;
	}

	async getCacheGlobalSounEffect(): Promise<BotCacheGlobalSoundEffect[] | null> {
		const document = doc(this.db, 'global/sound-effect');
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGlobalSoundEffect[]>caches.data();
		else console.error(red('[Cache Global] : Cache Not Found !'));
		return null;
	}

	async getCacheGlobalEmoji(): Promise<BotCacheGlobalGuildEmoji[] | null> {
		const document = doc(this.db, 'global/emoji');
		const caches = await getDoc(document);
		if (caches.exists()) return (<UtsukushiFirebaseGlobalEmoji>caches.data()).emojis;
		else console.error(red('[Cache Global] : Cache Not Found !'));
		return null;
	}

	async getCacheByGuild(guild: Guild): Promise<BotCacheGuild | null> {
		const document = doc(this.db, 'guild-data/' + guild.id);
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGuild>caches.data();
		else console.error(red('[Cache ' + guild.id + '] : Cache Not Found !'));
		return null;
	}

	async getUserData(user: DiscordUser): Promise<BotUserData | null> {
		const document = doc(this.db, 'user-data/' + user.id);
		const caches = await getDoc(document);
		if (caches.exists()) return <BotUserData>caches.data();
		else console.error(red('[UserData ' + user.id + '] : UserData Not Found !'));
		return null;
	}

	async resetUserData(user: DiscordUser): Promise<boolean> {
		const document = doc(this.db, 'user-data/' + user.id);
		return setDoc(document, initBotUserData)
			.then(() => {
				console.log(green('[UserData ' + user.id + '] : Cache Clear Success !'));
				return true;
			})
			.catch(() => {
				console.error(red('[UserData ' + user.id + '] : Cache Clear Failure !'));
				return false;
			});
	}

	async resetGuildData(guild: Guild): Promise<boolean> {
		const document = doc(this.db, 'guild-data/' + guild.id);
		return setDoc(document, initBotCacheGuild)
			.then(() => {
				console.log(green('[UserData ' + guild.id + '] : Cache Clear Success !'));
				return true;
			})
			.catch(() => {
				console.error(red('[UserData ' + guild.id + '] : Cache Clear Failure !'));
				return false;
			});
	}
}
