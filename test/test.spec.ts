/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// TEST
import { PingCommand } from '../src/modules/commands/PingCommand/ping';
import { GitCommand } from '../src/modules/commands/GitCommand/git';
import { ActivityCommand } from '../src/modules/commands/ActivityCommand/activity';
import { API } from '../src/utils/const';

import { BotClient } from '../src/class/BotClient';
import { BurgerAPI } from '../src/api/burger/BurgerAPI';
import { ApiBurgerReponse } from '../src/model/ApiBurgerResponse';

const BURGER_API_RESULT = /^https:\/\/foodish-api\.herokuapp\.com\/images\/burger\/burger\d+\..{3,4}$/;
const PING_RESULT = /🏓 Pong! \((\d+|NaN)ms\)/;

const client = new BotClient(true);

describe('Ping Module', () => {

	// // Ping command
	// test('Test Ping Command Without Client', () => {
	// 	expect(PingCommand.result(client)).toMatch(PING_RESULT);
	// });

	// // Ping command
	// test('Test Ping Command With Client', () => {
	// 	expect(PingCommand.result(, null)).toBe('‼️🤖 No Client found !');
	// });
});

describe('Burger Module', () => {

	// Burger command
	test('Test Big-Buger', async () => {
		const api = new BurgerAPI();
		const response = await api.getReponse();
		expect((<ApiBurgerReponse>response).image).toMatch(BURGER_API_RESULT);
	});

	// Burger command [Error]
	test('Test Big-Buger Error', async () => {
		const api = new BurgerAPI();
		const response = await api.getReponse(true);
		expect(<string>response).toMatch(API.BURGER.ERROR);
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