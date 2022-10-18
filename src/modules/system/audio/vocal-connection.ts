/* eslint-disable @typescript-eslint/no-explicit-any */
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { Message, VoiceChannel } from 'discord.js';
import { logger } from '@modules/system/logger/logger';
import { UtsukushiAudioPlayer } from './utsukushi-audio-player';

export class VocalConnection {
	connection: VoiceConnection | undefined = undefined;
	botPlayer: UtsukushiAudioPlayer | undefined = undefined;

	join(channel: VoiceChannel): void {
		this.connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		this.initEvents();
	}

	private initEvents(): void {
		this.connection?.on('stateChange', (oldState, newState) => {
			logger.info({ tag: 'Voice Connection', oldState: oldState.status, newState: newState.status });
		});

		this.connection?.on('error', (error) => {
			logger.error({ tag: 'Voice Connection' }, error.message);
			this.killConnection();
		});
	}

	newBotPlayer(message: Message): UtsukushiAudioPlayer | undefined {
		if (!this.connection) return undefined;
		this.botPlayer = new UtsukushiAudioPlayer(message, this.connection);
		return this.botPlayer;
	}

	killConnection(): void {
		this.botPlayer?.player.stop();
		this.botPlayer = undefined;
		this.connection?.destroy();
	}
}
