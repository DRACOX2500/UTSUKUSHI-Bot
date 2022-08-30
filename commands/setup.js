
module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
      
        if (interaction.commandName === 'ping') {
          await interaction.reply(`🏓 Pong! (${Math.round(client.ws.ping)}ms)`);
        }
    });
}