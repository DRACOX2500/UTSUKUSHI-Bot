import { config } from 'dotenv';
import { cyan, lightYellow } from 'ansicolor';
import {
	Client,
	GatewayIntentBits,
	ActivityType,
	PresenceStatusData,
} from 'discord.js';
import { Activity } from 'root/src/models/activity.model';
import { TWITCH_LINK } from '@utils/const';
import { VocalConnection } from '@modules/system/audio/VocalConnection';
import { CommandManager } from '@modules/interactions/CommandManager';
import { BotFirebase, FirebaseAuth } from 'root/src/database/firebase';
import { BotErrorManager } from '@errors/BotErrorManager';
import { BotRemoverManager } from '@modules/system/System';
import { CommandDeployer } from '@modules/interactions/CommandDeployer';

config({ path: '.env' });

export class BotClient extends Client {
	private DISCORD_TOKEN!: string;
	private CLIENT_ID!: string;

	private FIREBASE_TOKEN!: string;
	private database!: BotFirebase;

	connection: VocalConnection = new VocalConnection();

	removerManager!: BotRemoverManager;

	private commandManager!: CommandManager;

	private commandDeployer!: CommandDeployer;

	private errorManager!: BotErrorManager;

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

		this.removerManager = new BotRemoverManager(
			+(process.env.MAX_REMOVER_INSTANCES || 3)
		);

		const auth: FirebaseAuth = {
			email: process.env.DB_EMAIL || '',
			password: process.env.DB_PASSWORD || '',
		};

		const authDB = !!+(process.argv[2] ?? 1);
		if (authDB)
			this.database = new BotFirebase(this.FIREBASE_TOKEN, auth, test);

		this.init(test);
	}

	private init(test: boolean): void {
		this.errorManager = new BotErrorManager(this);
		this.initEvents();

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
			const cache = await this.database.getCacheGlobal();
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

	getDatabase(): BotFirebase {
		return this.database;
	}
}
