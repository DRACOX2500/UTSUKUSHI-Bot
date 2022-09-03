module.exports.loadCommands = async (client, log = true) => {
	if (!client) return 1;

	const { REST, Routes } = require('discord.js');
	const COMMANDS = require('../commands/setup')(client);

	const rest = new REST({ version: '10' }).setToken(client.token);

	await (async () => {
		try {
			if (log)
				console.log('Started refreshing application (/) commands.');

			await rest.put(Routes.applicationCommands(client.clientID), { body: COMMANDS });

			if (log)
				console.log('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			console.error(error);
		}
	})();
	return 0;
};