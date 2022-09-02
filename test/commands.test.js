/* eslint-disable no-undef */
// TEST
const { result: pingResult } = require('../commands/ping.js');
const { result: burgerResult, BURGER_ERROR } = require('../commands/big-burger.js');
const { result: gitResult } = require('../commands/git.js');
const { result: activityResult } = require('../commands/activity.js');

const { client } = require('../src/initBot.js');

const BURGER_API_RESULT = /^https:\/\/foodish-api\.herokuapp\.com\/images\/burger\/burger\d+\..{3,4}$/;

// Ping command
test('Test Ping Command Without Client', () => {
	expect(pingResult()).toBe('‼️🤖 No Client found !');
});

// Burger command
test('Test Big-Buger', async () => {
	const data = await burgerResult();
	expect(data).toMatch(BURGER_API_RESULT);
});

// Burger command [Error]
test('Test Big-Buger Error', async () => {
	const data = await burgerResult(true);
	expect(data).toMatch(BURGER_ERROR);
});

// Git command
test('Test Git Command', () => {
	expect(gitResult()).toBe('https://github.com/DRACOX2500/Discord-Bot');
});

// Activity command
test('Test Activity Command', () => {
	expect(activityResult(null, client)).toBe('🤖 Bot activity has been change !');
});