import { BotClient } from 'src/BotClient';

export class BotErrorManager {

	constructor(client: BotClient) {
		client.on('shardError', error => {
			console.error(`[${Date.now()}] A websocket connection encountered an error:`, error);
		});

		process.on('unhandledRejection', error => {
			console.error(`[${Date.now()}] Unhandled promise rejection:`, error);
		});
	}
}