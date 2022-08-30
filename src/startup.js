
module.exports = (TOKEN, CLIENT_ID, client) => {

    const { REST, Routes } = require('discord.js');
    require('../commands/setup')(client);

    const COMMANDS = [
        require('../commands/ping.js').PING_COMMAND,
    ];

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    (async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: COMMANDS });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();
};