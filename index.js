require('dotenv').config({ path: '.env' });
const login = process.argv[2] || 1;

const { client } = require('./src/initBot.js');

const { loadCommands } = require('./src/loadCommands.js');

loadCommands(client);

if (login !== '0')
	client.login(client.token);