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
import { UtsukushiFirebaseGlobalEmoji } from '@models/firebase/firebase.model';
import { FirebaseCache } from './utsukushi-cache';
import {
	BotCacheGlobal,
	BotCacheGlobalSoundEffect,
	BotCacheGlobalGuildEmoji,
	BotCacheGuild,
	BotUserDataTypes,
	BotUserData,
	initBotUserData,
	initBotCacheGuild,
} from '@models/firebase/document-data.model';
import { green } from 'ansicolor';
import { logger } from '@modules/system/logger/logger';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const NOT_FOUND_ERROR = 'not-found';

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

	dataCache!: FirebaseCache;

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
				this.dataCache = new FirebaseCache(this);
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
				logger.info({ tag: 'Cache Global' }, 'Cache Saved Success !');
			})
			.catch(() => {
				logger.error({ tag: 'Cache Global' }, 'Cache Saved Failure !');
			});
	}

	async setCacheGlobalSoundEffect(
		cache: BotCacheGlobalSoundEffect
	): Promise<void> {
		const document = doc(this.db, 'global/sound-effect');

		if (cache) {
			updateDoc(document, 'soundEffects', arrayUnion(cache))
				.then(() => {
					logger.info({ tag: 'Cache Global SoundEffect' }, 'Updated Success !');
				})
				.catch((error) => {
					if (error.code === NOT_FOUND_ERROR) {
						setDoc(document, cache)
							.then(() =>
								logger.info(
									{ tag: 'Cache Global SoundEffect' },
									'Updated New Try Success !'
								)
							)
							.catch(() =>
								logger.error(
									{ tag: 'Cache Global SoundEffect' },
									'Updated New Try Failure !'
								)
							);
					}
				});
		}
		else {
			logger.error(
				{ tag: 'Cache Global SoundEffect' },
				'Updated Failure (no cache) !'
			);
		}
	}

	async setCacheGlobalEmoji(
		...cache: BotCacheGlobalGuildEmoji[]
	): Promise<boolean> {
		const document = doc(this.db, 'global/emoji');
		let resFunct = true;

		if (cache) {
			await updateDoc(document, 'emojis', arrayUnion(...cache))
				.then(() => {
					logger.info(
						{ tag: 'ADD EMOJI' },
						`Updated Success (+${cache.length}) !`
					);
				})
				.catch((error) => {
					if (error.code === NOT_FOUND_ERROR) {
						setDoc(document, { emojis: cache })
							.then(() => logger.info({ tag: 'ADD EMOJI' }, 'Success !'))
							.catch(() => {
								logger.error({ tag: 'ADD EMOJI' }, 'Failed !');
								resFunct = false;
							});
					}
				});
		}
		return resFunct;
	}

	async deleteCacheGlobalEmoji(
		...cache: BotCacheGlobalGuildEmoji[]
	): Promise<boolean> {
		let resFunct = true;

		if (cache) {
			const document = doc(this.db, 'global/emoji/');

			await updateDoc(document, 'emojis', arrayRemove(...cache))
				.then(() => {
					logger.info(
						{ tag: 'DELETE EMOJI' },
						`Deleted Success (-${cache.length}) !`
					);
				})
				.catch(() => {
					logger.error({ tag: 'DELETE EMOJI' }, 'Failed !');
					resFunct = false;
				});
		}
		return resFunct;
	}

	async setCacheByGuild(guild: Guild, cache: BotCacheGuild): Promise<void> {
		const document = doc(this.db, 'guild-data/' + guild.id);
		setDoc(document, cache, { merge: true })
			.then(() => {
				logger.info(
					{ tag: 'Guild Data', guildId: guild.id },
					'Guild Data Saved Success'
				);
			})
			.catch(() => {
				logger.error(
					{ tag: 'Guild Data', guildId: guild.id },
					'Guild Data Saved Failure'
				);
			});
	}

	async setUserData(user: DiscordUser, cache: BotUserDataTypes): Promise<void> {
		const document = doc(this.db, 'user-data/' + user.id);

		if (cache.keyword) {
			updateDoc(document, 'keywords', arrayUnion(cache.keyword))
				.then(() => {
					logger.info(
						{ tag: 'User Data', userId: user.id },
						'User Data Saved Success'
					);
				})
				.catch((error) => {
					if (error.code === NOT_FOUND_ERROR) {
						setDoc(document, { keywords: [cache.keyword] })
							.then(() =>
								logger.info({ tag: 'User Data', userId: user.id }, 'Success !')
							)
							.catch(() =>
								logger.error({ tag: 'User Data', userId: user.id }, 'Failed !')
							);
					}
				});
			this.dataCache.userdata.delete(user.id);
		}
		else {
			setDoc(document, cache, { merge: true })
				.then(() => {
					logger.info(
						{ tag: 'User Data', userId: user.id },
						'User Data Saved Success !'
					);
				})
				.catch(() => {
					logger.error(
						{ tag: 'User Data', userId: user.id },
						'User Data Saved Success !'
					);
				});
		}
	}

	async getCacheGlobal(): Promise<BotCacheGlobal | null> {
		const document = doc(this.db, 'global/utsukushi');
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGlobal>caches.data();
		else logger.error({ tag: 'Glogal Data' }, 'Not Found !');
		return null;
	}

	async getCacheGlobalSounEffect(): Promise<
		BotCacheGlobalSoundEffect[] | null> {
		const document = doc(this.db, 'global/sound-effect');
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGlobalSoundEffect[]>caches.data();
		else logger.error({ tag: 'Glogal Data SoundEffect' }, 'Not Found !');
		return null;
	}

	async getCacheGlobalEmoji(): Promise<BotCacheGlobalGuildEmoji[] | null> {
		const document = doc(this.db, 'global/emoji');
		const caches = await getDoc(document);
		if (caches.exists())
			return (<UtsukushiFirebaseGlobalEmoji>caches.data()).emojis;
		else logger.error({ tag: 'Glogal Data Emoji' }, 'Not Found !');
		return null;
	}

	async getCacheByGuild(guild: Guild): Promise<BotCacheGuild | null> {
		const document = doc(this.db, 'guild-data/' + guild.id);
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGuild>caches.data();
		else logger.error({ tag: 'Guild Data', guildId: guild.id }, 'Not Found !');
		return null;
	}

	async getUserData(user: DiscordUser): Promise<BotUserData | null> {
		const document = doc(this.db, 'user-data/' + user.id);
		const caches = await getDoc(document);
		if (caches.exists()) return <BotUserData>caches.data();
		else logger.error({ tag: 'User Data', userId: user.id }, 'Not Found !');
		return null;
	}

	async resetUserData(user: DiscordUser): Promise<boolean> {
		const document = doc(this.db, 'user-data/' + user.id);
		return setDoc(document, initBotUserData)
			.then(() => {
				logger.info({ tag: 'User Data', userId: user.id }, 'Reset Sucess !');
				return true;
			})
			.catch(() => {
				logger.error({ tag: 'User Data', userId: user.id }, 'Reset Failed !');
				return false;
			});
	}

	async resetGuildData(guild: Guild): Promise<boolean> {
		const document = doc(this.db, 'guild-data/' + guild.id);
		return setDoc(document, initBotCacheGuild)
			.then(() => {
				logger.info({ tag: 'Guild Data', guildId: guild.id }, 'Reset Sucess !');
				return true;
			})
			.catch(() => {
				logger.error(
					{ tag: 'Guild Data', guildId: guild.id },
					'Reset Failed !'
				);
				return false;
			});
	}
}
