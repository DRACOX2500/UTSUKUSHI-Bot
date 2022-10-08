/* eslint-disable @typescript-eslint/no-explicit-any */
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { blue, red } from 'ansicolor';
import { Message } from 'discord.js';
import { BotPlayer } from './BotPlayer';

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
			console.log(blue(`Connection transitioned from ${oldState.status} to ${newState.status}`));
		});

		this.connection?.on('error', error => {
			console.error(red(`[Connection] Error : ${error.message}`));
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