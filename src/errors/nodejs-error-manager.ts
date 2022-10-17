/* eslint-disable @typescript-eslint/no-explicit-any */
import { UtsukushiClient } from 'src/utsukushi-client';
import { logger } from '@modules/system/logger/logger';

export class NodeJSErrorManager {
	constructor(client: UtsukushiClient) {
		client.on('shardError', (error) => {
			logger.error(
				{ tag: 'WebSocket', error: error },
				'A websocket connection encountered an error : ' + error.message
			);
		});

		process.on('unhandledRejection', (error) => {
			const mes = (<any>error)?.message ?? 'Uknown error';
			logger.error(
				{ tag: 'Promise Rejection', error: error },
				'Unhandled promise rejection : ' + mes
			);
		});
	}
}
