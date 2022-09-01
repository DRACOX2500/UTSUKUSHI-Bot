require('dotenv').config({ path: '.env' });
const login = process.argv[2] || 1;

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const { BotClient } = require('./src/Client');
const client = new BotClient({ token: TOKEN, clientID: CLIENT_ID });

require('./src/loadCommands.js')(client);

if(login === 0)
    client.login(TOKEN);