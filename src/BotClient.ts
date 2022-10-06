import { config } from 'dotenv';
import { Client, GatewayIntentBits, ActivityType, REST, Routes, PresenceStatusData, SlashCommandBuilder } from 'discord.js';
import { Activity } from '@models/Activity';
import { TWITCH_LINK } from '@utils/const';
import { VocalConnection } from '@modules/system/audio/VocalConnection';
import { CommandManager } from '@modules/interactions/CommandManager';
import { BotFirebase, FirebaseAuth } from 'src/database/Firebase';
import { BotErrorManager } from '@errors/BotErrorManager';
import { UtsukushiSlashCommand } from './models/UtsukushiSlashCommand';

config({ path: '.env' });

export class BotClient extends Client {

	private DISCORD_TOKEN!: string;
	private CLIENT_ID!: string;

	private FIREBASE_TOKEN!: string;
	private database!: BotFirebase;

	connection: VocalConnection = new VocalConnection();

	isRemoving = false;

	private commandManager!: CommandManager;

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
				GatewayIntentBits.GuildVoiceStates,
			],
		});

		this.DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
		this.CLIENT_ID = process.env.CLIENT_ID || '';
		this.FIREBASE_TOKEN = process.env.FIREBASE_TOKEN || '';

		const auth = new FirebaseAuth(
			process.env.DB_EMAIL || '',
			process.env.DB_PASSWORD || ''
		);

		const authDB = !!+(process.argv[2] ?? 1);
		if (authDB)
			this.database = new BotFirebase(this.FIREBASE_TOKEN, auth, test);

		this.init(test);
	}

	private init(test: boolean): void {
		this.errorManager = new BotErrorManager(this);
		this.initEvents();

		this.commandManager = new CommandManager(this);
		this.deployCommands(!test);
		this.commandManager.initCommand(this);
		this.commandManager.initBotEvents(this);
	}

	loginBot(): void {
		const login = !!+(process.argv[2] ?? 1);
		if (login) this.login();
	}

	private initEvents(): void {

		this.on('ready', async () => {
			console.log(`Logged in as ${this.user?.tag}!`);
			const cache = await this.database.getCacheGlobal();
			if (cache?.activity)
				this.setActivity(cache?.activity || this.defaultActivity);

			this.setStatus('idle');
		});
		this.on('error', console.error);
		this.on('warn', console.warn);
	}

	protected async deployCommands(log: boolean): Promise<number> {

		const rest = new REST({ version: '10' }).setToken(this.DISCORD_TOKEN);

		const slashCommands: SlashCommandBuilder[] = [];

		for (const iterator of this.commandManager.commands) {
			const value = this.commandManager.commands.get(iterator[0]);
			if (value) slashCommands.push(<SlashCommandBuilder>value.slash);
		}

		return (async (): Promise<number> => {
			try {
				if (log)
					console.log('Started refreshing application (/) commands.');

				await rest.put(Routes.applicationCommands(this.CLIENT_ID), { body: slashCommands });

				if (log)
					console.log('Successfully reloaded application (/) commands.');
			}
			catch (error) {
				console.error(error);
				return 1;
			}
			return 0;
		})();
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
