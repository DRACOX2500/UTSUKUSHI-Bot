/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioPlayer,
	createAudioResource,
	NoSubscriberBehavior,
	VoiceConnection,
} from '@discordjs/voice';
import { Message } from 'discord.js';
import { logger } from '@modules/system/logger/logger';

export class BotPlayer {
	player: AudioPlayer;

	resource: AudioResource<any> | null;

	connection!: VoiceConnection;

	origin!: Message;

	constructor(origin: Message, connection: VoiceConnection) {
		this.connection = connection;
		this.origin = origin;

		this.player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});
		this.connection.subscribe(this.player);
		this.resource = null;
		this.initEvents();
	}

	private initEvents() {
		this.player?.on('stateChange', (oldState, newState) => {
			logger.info({ tag: 'Audio player', oldState: oldState.status, newState: newState.status });
		});

		this.player?.on(AudioPlayerStatus.Idle, () => {
			this.player.stop();
			this.connection.destroy();
		});

		this.player?.on('error', (error) => {
			logger.error({ tag: 'Audio player' }, error.message);
		});
	}

	/**
	 * Play the audio player
	 * @param source string
	 * @param opti boolean
	 */
	playMusic(source: string, opti = false): void {
		if (!source) return;

		this.resource = createAudioResource<any>(source, { inlineVolume: !opti });

		this.resource.volume?.setVolume(1);
		this.player.play(this.resource);
	}

	volumeDown(): void {
		if (!this.resource || !this.resource.volume) return;

		let volume = this.resource.volume.volume;
		volume = Math.round((volume - 0.1 + Number.EPSILON) * 10) / 10;

		if (volume < 0) volume = 0;
		this.resource.volume.setVolume(volume);
	}

	volumeUp(): void {
		if (!this.resource || !this.resource.volume) return;

		let volume = this.resource.volume.volume;
		volume = Math.round((volume + 0.1 + Number.EPSILON) * 10) / 10;

		if (volume > 1) volume = 1;
		this.resource.volume.setVolume(volume);
	}

	getVolume(): number {
		if (!this.resource || !this.resource.volume) return 1;
		return this.resource.volume.volume;
	}
}
