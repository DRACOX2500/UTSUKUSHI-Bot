import { BOT_EVENTS } from '../constants';
import { BotClient } from '../core/bot-client';
import { type OnAfterReady } from '../core/bot-client-events';
import { Starter } from '../core/starter';
import { connectMongoDB } from '../database/database';
import { ProfileService } from '../services/profile-service';
import { UtsukushiStore } from '../services/stores/utsukushi.store';
import { type OnAfterDatabaseReady, type OnAfterStoreInit, type OnAfterUtsukushiReady } from '../types/bot-client-events';
import { type UtsukushiBotConfig } from '../types/business';
import { GatewayIntentBits } from 'discord.js';
import { PlayerService } from '../services/player-service';

const REQUIREMENT = [
	'utsukushi',
	'database',
	'login',
	'store',
];

export class UtsukushiBotClient extends BotClient
	implements OnAfterReady, OnAfterDatabaseReady, OnAfterUtsukushiReady, OnAfterStoreInit {

	private _store!: UtsukushiStore;
	protected readonly starter: Starter;

	constructor(config?: Partial<UtsukushiBotConfig>) {
		super(
			ProfileService.profile,
			[
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildVoiceStates,
			],
			config,
		);
		this.starter = new Starter(REQUIREMENT, () => { this.setBotStatusData(); });
		this.on(BOT_EVENTS.DATABASE_CONNECTED, this.onAfterDatabaseReady);
		this.on(BOT_EVENTS.READY, this.onAfterUtsukushiReady);
		this.on(BOT_EVENTS.STORE_INIT, this.onAfterStoreInit);

		this.init(config);
	}

	async init(config?: Partial<UtsukushiBotConfig>): Promise<void> {
		if (!config?.ignoreDB) await connectMongoDB(this);
		if (!config?.ignoreStore) {
			this._store = new UtsukushiStore();
			this._store.initialize(this);
		}
		this.emit(BOT_EVENTS.READY);
	}

	get store(): UtsukushiStore {
		return this._store;
	}

	setBotStatusData(): void {
		const syst = this._store.system;
		super.setActivity(syst.activity);
		super.setStatus(syst.status);
	}

	override async onAfterReady(): Promise<void> {
		await PlayerService.init(this);
		this.starter.check('login');
	}

	onAfterDatabaseReady(): void {
		this.starter.check('database');
	}

	onAfterUtsukushiReady(): void {
		this.starter.check('utsukushi');
	}

	onAfterStoreInit(): void {
		this.starter.check('store');
	}
}