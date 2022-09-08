import { FirebaseApp, initializeApp } from 'firebase/app';
import { doc, Firestore, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Auth, getAuth, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth';
import { Guild } from 'discord.js';
import { BotCacheGlobal, BotCacheGuild, BotCacheGuildTypes } from 'src/model/BotCache';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

	constructor(key: string, firebaseAuth: FirebaseAuth) {
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

}