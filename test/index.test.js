// TEST
const { result: pingResult } = require('../commands/ping.js');
const { result: burgerResult } = require('../commands/big-burger.js');
const { result: gitResult } = require('../commands/git.js');

const BURGER_API = /^https:\/\/foodish-api\.herokuapp\.com\/images\/burger\/burger\d+\..{3,4}$/;

// Ping command
test('Test Ping Command Without Client', () => {
    expect(pingResult()).toBe('‼️🤖 No Client found !');
});

// Ping command
test('Test Big-Buger', async () => {
    const data = await burgerResult()
    expect(data).toMatch(BURGER_API);
});

// Git command
test('Test Git Command', () => {
    expect(gitResult()).toBe('https://github.com/DRACOX2500/Discord-Bot');
});