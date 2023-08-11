import { ActivityType, Client, GatewayIntentBits, PresenceStatusData } from 'discord.js';
import { BotActivity, BotConfig, ProgProfil } from './types/business';
import { environment } from '@/environment';
import { botLoginLog } from '@/core/logger';
import { ERROR_USERNAME, TWITCH_LINK } from '@/constants';
import { InteractionsManager } from './interactions-manager';

export class BotClient extends Client {

	protected _cmdManager: InteractionsManager;

	private username: string = ERROR_USERNAME;
	private readonly config: BotConfig;

	constructor(profil: ProgProfil = 'prod', intents: GatewayIntentBits[] = [], config?: Partial<BotConfig>) {
		super({ intents });
		this.config = {
			default: {
				status: 'idle',
				activity: {
					status: `version ${environment.APP_VERSION}`,
					type: ActivityType.Streaming,
					url: TWITCH_LINK,
				},
			},
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
			botLoginLog(this.username);
			// TODO: remove
			// const cache = await this.memory.global.fetchData();
			// if (cache?.activity)
			//     this.setActivity(cache?.activity || this.defaultActivity);
			this.setStatus(this.config.default.status);
		});
		this.on('error', console.error);
		this.on('warn', console.warn);
	}

	setUsername(username?: string): void {
		this.username = username ?? ERROR_USERNAME;
	}

	setActivity(activity: BotActivity): void {
		this.user?.setActivity(activity.status, activity);
	}

	setStatus(status: PresenceStatusData): void {
		this.user?.setStatus(status);
	}

	get cmdManager(): InteractionsManager {
		return this._cmdManager;
	}
}
