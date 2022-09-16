import { GitCommand } from '../src/modules/commands/GitCommand/git';

describe('Git Module', () => {

	test('Test Git Command', () => {
		expect(GitCommand.result()).toBe('https://github.com/DRACOX2500/Discord-Bot');
	});
});