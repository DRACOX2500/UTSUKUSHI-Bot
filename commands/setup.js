const { bold, italic } = require("discord.js");

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        console.log(interaction);
      
        if (interaction.commandName === 'ping') {
            if(Math.random(5) == 1 )
          	    await interaction.reply(italic(bold(`🏓🔥 SMAAAAAAAAAAAAAAAAASH! (${Math.round(client.ws.ping)}ms)`)));
            else
                await interaction.reply(italic(bold(`🏓 Pong! (${Math.round(client.ws.ping)}ms)`)));
        }

        if (interaction.commandName === 'big-burger') {
            const axios = require("axios");
            let result = "";

            const options = {
                method: 'GET',
                url: 'https://foodish-api.herokuapp.com/api/images/burger/'
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
                result = response.data;
                interaction.reply(result.image);

            }).catch(function (error) {
                console.error(error);
                return;
            });
        }
    });
}