import { red } from 'ansicolor';
import { BotClient } from 'src/BotClient';

export class BotErrorManager {
	constructor(client: BotClient) {
		client.on('shardError', (error) => {
			console.error(
				`[${red(
					'ERROR'
				)} - ${Date.now()}] A websocket connection encountered an error:`,
				error
			);
		});

		process.on('unhandledRejection', (error) => {
			console.error(
				`[${red('ERROR')} - ${Date.now()}] Unhandled promise rejection:`,
				error
			);
		});
	}
}
