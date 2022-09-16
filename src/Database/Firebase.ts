/* eslint-disable @typescript-eslint/no-explicit-any */
import { FirebaseApp, initializeApp } from 'firebase/app';
import { doc, Firestore, getDoc, getFirestore, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Auth, getAuth, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth';
import { Guild, User as DiscordUser } from 'discord.js';
import { BotCacheGlobal, BotCacheGuild, BotCacheGuildTypes } from '../model/BotCache';
import { BotUserData, BotUserDataTypes } from '../model/BotUserData';
import { initBotUserData } from '../model/BotUserData';
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

export class FirebaseAuth {

	email!: string;
	password!: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
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
				if (!test) console.log('Connect to Firebase !');
			})
			.catch((error) => {
				console.error(error);
			});

		this.db = getFirestore();

	}

	async setCacheGlobal(cache: BotCacheGlobal): Promise<void> {
		const document = doc(this.db, 'cache/global');
		setDoc(document, cache, { merge: true })
			.then(() => {
				console.log('[Cache Global] : Cache Saved Success !');
			})
			.catch(() => {
				console.error('[Cache Global] : Cache Saved Failure !');
			});
	}

	async setCacheByGuild(guild: Guild, cache: BotCacheGuildTypes): Promise<void> {

		const document = doc(this.db, 'cache/' + guild.id);
		setDoc(document, cache, { merge: true })
			.then(() => {
				console.log('[Cache ' + guild.id + '] : Cache Saved Success !');
			})
			.catch(() => {
				console.error('[Cache ' + guild.id + '] : Cache Saved Failure !');
			});
	}

	async setUserData(user: DiscordUser, cache: BotUserDataTypes): Promise<void> {
		const document = doc(this.db, 'user-data/' + user.id);

		if (cache.keyword) {
			updateDoc(document, 'keywords', arrayUnion(cache.keyword))
				.then(() => {
					console.log('[UserData ' + user.id + '] : UserData Updated Success !');
				})
				.catch((error) => {
					console.error('[UserData ' + user.id + '] : UserData Updated Failure !');
					if (error.code === NOT_FOUND_ERROR) {
						console.log('[UserData ' + user.id + '] : Try to create doc...');
						setDoc(document, { keywords: [cache.keyword] })
							.then(() => console.log('[UserData ' + user.id + '] : Success !'))
							.catch(() => console.log('[UserData ' + user.id + '] : Failed !'));
					}
				});
			this.userDataCache.userdata.delete(user.id);
		}
		else {
			setDoc(document, cache, { merge: true })
				.then(() => {
					console.log('[Cache ' + user.id + '] : Cache Saved Success !');
				})
				.catch(() => {
					console.error('[Cache ' + user.id + '] : Cache Saved Failure !');
				});
		}
	}

	async getCacheGlobal(): Promise<BotCacheGlobal | null> {
		const document = doc(this.db, 'cache/global');
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGlobal>caches.data();
		else console.error('[Cache Global] : Cache Not Found !');
		return null;
	}

	async getCacheByGuild(guild: Guild): Promise<BotCacheGuild | null> {
		const document = doc(this.db, 'cache/' + guild.id);
		const caches = await getDoc(document);
		if (caches.exists()) return <BotCacheGuild>caches.data();
		else console.error('[Cache ' + guild.id + '] : Cache Not Found !');
		return null;
	}

	async getUserData(user: DiscordUser): Promise<BotUserData | null> {
		const document = doc(this.db, 'user-data/' + user.id);
		const caches = await getDoc(document);
		if (caches.exists()) return <BotUserData>caches.data();
		else console.error('[UserData ' + user.id + '] : UserData Not Found !');
		return null;
	}

	async resetUserData(user: DiscordUser): Promise<boolean> {
		const document = doc(this.db, 'user-data/' + user.id);
		return setDoc(document, initBotUserData)
			.then(() => {
				console.log('[UserData ' + user.id + '] : Cache Clear Success !');
				return true;
			})
			.catch(() => {
				console.error('[UserData ' + user.id + '] : Cache Clear Failure !');
				return false;
			});
	}

}