require('dotenv').config({ path: '.env' });

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const { BotClient } = require('./class/Client.js');
const client = new BotClient({ token: TOKEN, clientID: CLIENT_ID });
exports.client = client;