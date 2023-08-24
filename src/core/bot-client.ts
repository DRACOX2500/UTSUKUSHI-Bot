import { Client, type GatewayIntentBits, type PresenceStatusData } from 'discord.js';
import { type BotActivity, type BotConfig, type ProgProfile } from './types/business';
import logger from './logger';
import { InteractionsManager } from './interactions-manager';
import { DEFAULT_ACTIVITY, ERROR_USERNAME } from './constants';
import { type BotClientEvents } from './bot-client-events';

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
		this.on('interactionCreate', async (interaction) => { await this._cmdManager.handleInteractions(interaction, this); },
		);
		this.on('ready', async (client: Client) => {
			this.setUsername(client.user?.username);
			logger.botLoginLog(this.username);
			this.onAfterReady();
		});
		this.on('error', err => { logger.error('BOT', err); });
		this.on('warn', logger.warn);

		this.on('shardError', (error) => {
			logger.error(
				'A websocket connection encountered an error : ' + error.message,
				error,
			);
		});

		process.on('unhandledRejection', (error: any) => {
			logger.error(
				'Unhandled promise rejection : ' + error?.message,
				error,
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

	onAfterReady(): void {
		// OVERRIDE
	}
}
