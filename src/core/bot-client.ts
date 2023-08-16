import { Client, GatewayIntentBits, PresenceStatusData } from 'discord.js';
import { BotActivity, BotConfig, ProgProfile } from './types/business';
import logger from './logger';
import { InteractionsManager } from './interactions-manager';
import { DEFAULT_ACTIVITY, ERROR_USERNAME } from './constants';
import { BotClientEvents } from './bot-client-events';

export class BotClient extends Client implements BotClientEvents {

	protected _cmdManager: InteractionsManager;

	private username: string = ERROR_USERNAME;
	private readonly config: BotConfig;

	constructor(profil: ProgProfile = 'prod', intents: GatewayIntentBits[] = [], config?: Partial<BotConfig>) {
		super({ intents });
		this.config = {
			default: DEFAULT_ACTIVITY,
			...config,
		};
		this._cmdManager = new InteractionsManager(this);
		this.initBotEvents();
	}

	private initBotEvents(): void {
		this.on('interactionCreate', (interaction) =>
			this._cmdManager.handleInteractions(interaction, this)
		);
		this.on('ready', async (client: Client) => {
			this.setUsername(client.user?.username);
			logger.botLoginLog(this.username);
			this.setStatus(this.config.default.status);
			this.onAfterReady();
		});
		this.on('error', logger.error);
		this.on('warn', logger.warn);

		this.on('shardError', (error) => {
			logger.error(
				{ tag: 'WebSocket', error: error },
				'A websocket connection encountered an error : ' + error.message
			);
		});

		process.on('unhandledRejection', (error: any) => {
			logger.error(
				{ tag: 'Promise Rejection', error: error },
				'Unhandled promise rejection : ' + error?.message
			);
		});
	}

	setUsername(username?: string): void {
		this.username = username ?? ERROR_USERNAME;
	}

	setActivity(activity: BotActivity): void {
		this.user?.setActivity(activity.status, {
			type: activity.code,
			...activity,
		});
	}

	setStatus(status: PresenceStatusData): void {
		this.user?.setStatus(status);
	}

	get cmdManager(): InteractionsManager {
		return this._cmdManager;
	}

	onAfterReady(): void {}
}
