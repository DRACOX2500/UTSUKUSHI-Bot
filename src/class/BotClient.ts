import { config } from 'dotenv';
import { Client, GatewayIntentBits, ActivityType, REST, Routes, PresenceStatusData } from 'discord.js';
import { Activity } from '../model/Activity';
import { TWITCH_LINK } from '../utils/const';
import { VocalConnection } from './VocalConnection';
import { COMMANDS, CommandSetup } from '../commands/setup';

config({ path: '.env' });

export class BotClient extends Client {

	private DISCORD_TOKEN!: string;
	private CLIENT_ID!: string;

	connection: VocalConnection = new VocalConnection();

	private setup: CommandSetup = new CommandSetup();

	private defaultActivity: Activity = {
		status: ':]',
		type: ActivityType.Streaming,
		url: TWITCH_LINK,
	};

	constructor(test = false) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildVoiceStates,
			],
		});

		this.DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
		this.CLIENT_ID = process.env.CLIENT_ID || '';

		this.init(test);
	}

	private init(test: boolean): void {
		this.initEvents();
		this.loadCommands(!test);
		this.setup.initCommand(this);
	}

	loginBot(): void {
		const login = process.argv[2] || 1;
		if (login !== '0') this.login();
	}

	private initEvents(): void {

		this.on('ready', () => {
			console.log(`Logged in as ${this.user?.tag}!`);
			this.setActivity(this.defaultActivity);
			this.setStatus('idle');
		});
		this.on('error', console.error);
		this.on('warn', console.warn);
	}

	protected async loadCommands(log: boolean): Promise<number> {

		const rest = new REST({ version: '10' }).setToken(this.DISCORD_TOKEN);

		return (async (): Promise<number> => {
			try {
				if (log)
					console.log('Started refreshing application (/) commands.');

				await rest.put(Routes.applicationCommands(this.CLIENT_ID), { body: COMMANDS });

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
}
