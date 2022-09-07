/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// TEST
import { PingCommand } from '../src/commands/PingCommand/ping';
import { BigBurgerCommand } from '../src/commands/BigBurgerCommand/big-burger';
import { GitCommand } from '../src/commands/GitCommand/git';
import { ActivityCommand } from '../src/commands/ActivityCommand/activity';
import { BURGER_ERROR } from '../src/utils/const';

import { BotClient } from '../src/class/BotClient';

const BURGER_API_RESULT = /^https:\/\/foodish-api\.herokuapp\.com\/images\/burger\/burger\d+\..{3,4}$/;
const PING_RESULT = /🏓 Pong! \((\d+|NaN)ms\)/;

const client = new BotClient(true);

describe('Ping Module', () => {

	// Ping command
	test('Test Ping Command Without Client', () => {
		expect(PingCommand.result(client)).toMatch(PING_RESULT);
	});

	// Ping command
	test('Test Ping Command With Client', () => {
		expect(PingCommand.result(null)).toBe('‼️🤖 No Client found !');
	});
});

describe('Burger Module', () => {

	// Burger command
	test('Test Big-Buger', async () => {
		const data = await BigBurgerCommand.result();
		expect(data).toMatch(BURGER_API_RESULT);
	});

	// Burger command [Error]
	test('Test Big-Buger Error', async () => {
		const data = await BigBurgerCommand.result(true);
		expect(data).toMatch(BURGER_ERROR);
	});
});

describe('Git Module', () => {

	// Git command
	test('Test Git Command', () => {
		expect(GitCommand.result()).toBe('https://github.com/DRACOX2500/Discord-Bot');
	});
});

describe('Activity Module', () => {

	// Activity command
	test('Test Activity Command', () => {
		expect(ActivityCommand.result(null, client)).toBe('❌🤖 Bot activity not change !');
	});
});