/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'dotenv';
import { cyan, lightYellow } from 'ansicolor';
import {
	Client,
	GatewayIntentBits,
	ActivityType,
	PresenceStatusData,
} from 'discord.js';
import { Activity } from '@models/activity.model';
import { TWITCH_LINK } from 'src/constant';
import { VocalConnection } from '@modules/system/audio/vocal-connection';
import { CommandManager } from '@modules/interactions/command-manager';
import { NodeJSErrorManager } from '@errors/nodejs-error-manager';
import { BotMessageRemoverManager } from '@modules/system/bot-message-remover';
import { CommandDeployer } from '@modules/interactions/command-deployer';
import { UtsukushiCache } from '@database/utsukushi-cache';
import { UtsukushiFirebase } from '@database/firebase';

config({ path: '.env' });

export class UtsukushiClient extends Client {
	private DISCORD_TOKEN!: string;
	private CLIENT_ID!: string;

	private FIREBASE_TOKEN!: string;
	private memory!: UtsukushiCache;

	connection: VocalConnection = new VocalConnection();

	removerManager!: BotMessageRemoverManager;

	private commandManager!: CommandManager;

	private commandDeployer!: CommandDeployer;

	private errorManager!: NodeJSErrorManager;

	private defaultActivity: Activity = {
		status: ':]',
		type: ActivityType.Streaming,
		url: TWITCH_LINK,
	};

	constructor(readonly test = false) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildVoiceStates,
			],
		});

		this.DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
		this.CLIENT_ID = process.env.CLIENT_ID || '';
		this.FIREBASE_TOKEN = process.env.FIREBASE_TOKEN || '';

		this.removerManager = new BotMessageRemoverManager(
			+(process.env.MAX_REMOVER_INSTANCES || 3)
		);

		const auth = {
			email: process.env.DB_EMAIL || '',
			password: process.env.DB_PASSWORD || '',
		};

		const authDB = !!+(process.argv[2] ?? 1);
		if (authDB) {
			const database = new UtsukushiFirebase.UtsukushiFirestore(this.FIREBASE_TOKEN, auth, (firestore) => {
				this.memory = new UtsukushiCache(firestore);
				this.initEvents();
			},
			{ logEnabled: test });
		}
		this.init(test);
	}

	private init(test: boolean): void {
		this.errorManager = new NodeJSErrorManager(this);

		this.commandManager = new CommandManager(this);
		this.commandDeployer = new CommandDeployer(
			this.DISCORD_TOKEN,
			this.CLIENT_ID,
			this.commandManager.commands,
			this.commandManager.contexts
		);
		this.commandDeployer.deployGlobal({ test: test });
		this.commandDeployer.deployPrivate({ test: test });
		this.commandManager.initCommand(this);
		this.commandManager.initBotEvents(this);
	}

	loginBot(): void {
		const login = !!+(process.argv[2] ?? 1);
		if (login) this.login();
	}

	private initEvents(): void {
		this.on('ready', async () => {
			console.log(lightYellow(`Logged in as ${cyan(this.user?.tag)}!`));
			const cache = await this.memory.global.fetchData();
			if (cache?.activity)
				this.setActivity(cache?.activity || this.defaultActivity);

			this.setStatus('idle');
		});
		this.on('error', console.error);
		this.on('warn', console.warn);
	}

	setActivity(activity: Activity): void {
		this.user?.setActivity(activity.status, activity);
	}

	setStatus(status: PresenceStatusData): void {
		this.user?.setStatus(status);
	}

	getDatabase(): UtsukushiCache {
		return this.memory;
	}
}
