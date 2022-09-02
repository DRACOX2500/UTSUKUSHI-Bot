/* eslint-disable no-undef */
// TEST
const { client } = require('../src/initBot.js');
const { loadCommands } = require('../src/loadCommands.js');

// Index
test('Test Index With Client', async () => {
	const data = await loadCommands(client, false);
	expect(data).toBe(0);
});

// Index no client
test('Test Index Without Client', async () => {
	const data = await loadCommands(null, false);
	expect(data).toBe(1);
});