import { client } from './test.spec';
import { CacheCommand } from '../src/modules/commands/CacheCommand/cache';

describe('Cache Module', () => {

	// Activity command
	test('Test cache Command Clear', async () => {
		const cacheRes = await CacheCommand.result(null, client);
		expect(cacheRes).toBe(void 0);
	});
});