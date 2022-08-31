
require('dotenv').config({path: '.env'});
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID =  process.env.CLIENT_ID;

const { BotClient } = require('./src/Client');
const client = new BotClient({token: TOKEN, clientID: CLIENT_ID});

require('./src/loadCommands.js')(client);

client.login(TOKEN);