import { client } from './test.spec';
import { ActivityCommand } from '../src/modules/commands/ActivityCommand/activity';

describe('Activity Module', () => {

	// Activity command
	test('Test Activity Command', () => {
		expect(ActivityCommand.result(null, client)).toBe('❌🤖 Bot activity not change !');
	});
});