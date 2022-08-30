
module.exports = (TOKEN, CLIENT_ID, client) => {

    const { REST, Routes } = require('discord.js');
    const COMMANDS = require('../commands/setup')(client);

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    (async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: COMMANDS });
        console.log(COMMANDS);

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();
};