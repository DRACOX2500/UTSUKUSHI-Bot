/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from 'firebase/app';
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
import { Auth, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { green } from 'ansicolor';
import { logger } from '@modules/system/logger/logger';
import {
	GlobalData,
	GlobalDataEmoji,
	GlobalDataSoundEffect,
	GuildData,
	UserData,
} from '@models/firebase/document-data.model';
import { UtsukushiFirebaseGlobalEmoji } from '@models/firebase/firebase.model';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const NOT_FOUND_ERROR = 'not-found';

namespace FirebaseCollections {
	namespace FirebaseDocuments {
		export class SoundEffectDocument {
			constructor(private firestore: UtsukushiFirebase.UtsukushiFirestore) {}

			async set(cache: GlobalDataSoundEffect[]): Promise<void> {
				const document = doc(this.firestore.db, 'global/sound-effect');

				if (cache) {
					updateDoc(document, 'soundEffects', arrayUnion(...cache))
						.then(() => {
							logger.info(
								{ tag: 'Cache Global SoundEffect' },
								'Updated Success !'
							);
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

			async get(): Promise<
				GlobalDataSoundEffect[] | null> {
				const document = doc(this.firestore.db, 'global/sound-effect');
				const caches = await getDoc(document);
				if (caches.exists()) return <GlobalDataSoundEffect[]>caches.data().soundEffects;
				else logger.error({ tag: 'Global Data SoundEffect' }, 'Not Found !');
				return null;
			}
		}

		export class EmojiDocument {
			constructor(private firestore: UtsukushiFirebase.UtsukushiFirestore) {}

			async set(...cache: GlobalDataEmoji[]): Promise<boolean> {
				const document = doc(this.firestore.db, 'global/emoji');
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

			async delete(...cache: GlobalDataEmoji[]): Promise<boolean> {
				let resFunct = true;

				if (cache) {
					const document = doc(this.firestore.db, 'global/emoji/');

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

			async get(): Promise<GlobalDataEmoji[] | null> {
				const document = doc(this.firestore.db, 'global/emoji');
				const caches = await getDoc(document);
				if (caches.exists())
					return (<UtsukushiFirebaseGlobalEmoji>caches.data()).emojis;
				else logger.error({ tag: 'Global Data Emoji' }, 'Not Found !');
				return null;
			}
		}
	}

	const FirestoreInitialDocuments = {
		user: {
			keywords: [],
		},
		guild: {
			lastPlayURL: null,
			vocalNotifyChannel: null,
			shareEmojis: false,
		},
	};

	export class GlobalCollection {
		readonly soundEffects: FirebaseDocuments.SoundEffectDocument;
		readonly emojis: FirebaseDocuments.EmojiDocument;

		constructor(private firestore: UtsukushiFirebase.UtsukushiFirestore) {
			this.soundEffects = new FirebaseDocuments.SoundEffectDocument(
				this.firestore
			);
			this.emojis = new FirebaseDocuments.EmojiDocument(this.firestore);
		}

		async set(cache: GlobalData): Promise<void> {
			const document = doc(this.firestore.db, 'global/utsukushi');

			setDoc(document, cache, { merge: true })
				.then(() => {
					logger.info({ tag: 'Cache Global' }, 'Cache Saved Success !');
				})
				.catch(() => {
					logger.error({ tag: 'Cache Global' }, 'Cache Saved Failure !');
				});
		}

		async get(): Promise<GlobalData | null> {
			const document = doc(this.firestore.db, 'global/utsukushi');
			const caches = await getDoc(document);
			if (caches.exists()) return <GlobalData>caches.data();
			else logger.error({ tag: 'Global Data' }, 'Not Found !');
			return null;
		}
	}

	export class UsersCollection {
		constructor(private firestore: UtsukushiFirebase.UtsukushiFirestore) {}

		async get(userID: string): Promise<UserData | null> {
			const document = doc(this.firestore.db, 'user-data/' + userID);
			const caches = await getDoc(document);
			if (caches.exists()) return <UserData>caches.data();
			else logger.error({ tag: 'User Data', userId: userID }, 'Not Found !');
			return null;
		}

		async set(userID: string, cache: UserData): Promise<void> {
			const document = doc(this.firestore.db, 'user-data/' + userID);

			if (cache.keywords.length > 0) {
				updateDoc(document, 'keywords', arrayUnion(...cache.keywords))
					.then(() => {
						logger.info(
							{ tag: 'User Data', userId: userID },
							'User Data Saved Success'
						);
					})
					.catch((error) => {
						if (error.code === NOT_FOUND_ERROR) {
							setDoc(document, { keywords: cache.keywords })
								.then(() =>
									logger.info({ tag: 'User Data', userId: userID }, 'Success !')
								)
								.catch(() =>
									logger.error({ tag: 'User Data', userId: userID }, 'Failed !')
								);
						}
					});
			}
		}

		async reset(userID: string): Promise<boolean> {
			const document = doc(this.firestore.db, 'user-data/' + userID);
			return setDoc(document, FirestoreInitialDocuments.user)
				.then(() => {
					logger.info({ tag: 'User Data', userId: userID }, 'Reset Sucess !');
					return true;
				})
				.catch(() => {
					logger.error({ tag: 'User Data', userId: userID }, 'Reset Failed !');
					return false;
				});
		}
	}

	export class GuildsCollection {
		constructor(private firestore: UtsukushiFirebase.UtsukushiFirestore) {}

		async get(guildID: string): Promise<GuildData | null> {
			const document = doc(this.firestore.db, 'guild-data/' + guildID);
			const caches = await getDoc(document);
			if (caches.exists()) return <GuildData>caches.data();
			else logger.error({ tag: 'Guild Data', guildId: guildID }, 'Not Found !');
			return null;
		}

		async set(guildID: string, cache: GuildData): Promise<void> {
			const document = doc(this.firestore.db, 'guild-data/' + guildID);
			setDoc(document, cache, { merge: true })
				.then(() => {
					logger.info(
						{ tag: 'Guild Data', guildId: guildID },
						'Guild Data Saved Success'
					);
				})
				.catch(() => {
					logger.error(
						{ tag: 'Guild Data', guildId: guildID },
						'Guild Data Saved Failure'
					);
				});
		}

		async reset(guildID: string): Promise<boolean> {
			const document = doc(this.firestore.db, 'guild-data/' + guildID);
			return setDoc(document, FirestoreInitialDocuments.guild)
				.then(() => {
					logger.info(
						{ tag: 'Guild Data', guildId: guildID },
						'Reset Sucess !'
					);
					return true;
				})
				.catch(() => {
					logger.error(
						{ tag: 'Guild Data', guildId: guildID },
						'Reset Failed !'
					);
					return false;
				});
		}
	}
}

export namespace UtsukushiFirebase {
	interface FirebaseAuth {
		email: string;
		password: string;
	}

	interface FirebaseOptions {
		logEnabled?: boolean;
	}

	export class UtsukushiFirestore {
		/**
		 * Firebase configuration
		 */
		private firebaseConfig = {
			apiKey: '',
			authDomain: 'utsukushi-database.firebaseapp.com',
			projectId: 'utsukushi-database',
			storageBucket: 'utsukushi-database.appspot.com',
			messagingSenderId: '695089030418',
			appId: '1:695089030418:web:1c628025fa4d37ae7a3fcb',
		};

		private auth!: Auth;
		readonly db: Firestore;

		// Firebase Documents

		readonly collections!: {
			global: FirebaseCollections.GlobalCollection,
			user: FirebaseCollections.UsersCollection,
			guild: FirebaseCollections.GuildsCollection,
		};

		constructor(
			key: string,
			firebaseAuth: FirebaseAuth,
			callback: (firestore: UtsukushiFirestore) => void,
			options?: FirebaseOptions,
		) {
			this.firebaseConfig.apiKey = key;

			// Initialize Firebase
			initializeApp(this.firebaseConfig);
			this.auth = getAuth();
			signInWithEmailAndPassword(
				this.auth,
				firebaseAuth.email,
				firebaseAuth.password
			)
				.then(() => {
					if (!options?.logEnabled) console.log(green('Connect to Firebase !'));
					callback(this);
				})
				.catch((error) => {
					logger.error({ tag: 'UtsukushiFirebase' }, error);
				});

			this.db = getFirestore();
			this.collections = {
				global: new FirebaseCollections.GlobalCollection(this),
				user: new FirebaseCollections.UsersCollection(this),
				guild: new FirebaseCollections.GuildsCollection(this),
			};
		}
	}
}
