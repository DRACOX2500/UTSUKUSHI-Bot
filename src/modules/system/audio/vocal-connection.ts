/* eslint-disable @typescript-eslint/no-explicit-any */
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { Message } from 'discord.js';
import { logger } from '../logger/logger';
import { BotPlayer } from './bot-player';

export class VocalConnection {
	connection: VoiceConnection | null = null;
	botPlayer: BotPlayer | null = null;

	join(channel: any): void {
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
		});
	}

	newBotPlayer(message: Message): BotPlayer | null {
		if (!this.connection) return null;
		this.botPlayer = new BotPlayer(message, this.connection);
		return this.botPlayer;
	}

	killConnection(): void {
		this.botPlayer?.player.stop();
		this.botPlayer = null;
		this.connection?.destroy();
	}
}
