const { bold, italic } = require("discord.js");

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
      
        if (interaction.commandName === 'ping') {
          	await interaction.reply(italic(bold(`🏓 Pong! (${Math.round(client.ws.ping)}ms)`)));
        }
    });
}