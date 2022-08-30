
require('dotenv').config({path: '.env'});
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID =  process.env.CLIENT_ID;

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

require('./src/startup.js')(TOKEN, CLIENT_ID, client);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Toute la journée !');
  client.user.setStatus('idle');
});
client.on("error", console.error);
client.on("warn", console.warn);

client.login(TOKEN);