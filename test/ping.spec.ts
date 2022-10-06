import { client } from './test.spec';
import { PingCommand } from '@modules/interactions/commands/PingCommand/ping';

describe('Ping Module', () => {

	test('Test Ping Command With Client', async () => {
		const pingRes = await PingCommand.result(null, client);
		expect(pingRes).toBe(void 0);
	});

	test('Test Ping Command Without Client', async () => {
		const pingRes = await PingCommand.result(null, null);
		expect(pingRes).toBe(1);
	});
});