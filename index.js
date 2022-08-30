
require('dotenv').config({path: '.env'});
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID =  process.env.CLIENT_ID;

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

require('./src/startup.js')(TOKEN, CLIENT_ID, client);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN);