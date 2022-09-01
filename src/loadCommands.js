module.exports = (client) => {

	const { REST, Routes } = require('discord.js');
	const COMMANDS = require('../commands/setup')(client);

	const rest = new REST({ version: '10' }).setToken(client.token);

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(Routes.applicationCommands(client.clientID), { body: COMMANDS });

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			console.error(error);
		}
	})();
};