const { bold, italic } = require("discord.js");

const ping = require('../commands/ping.js');
const burger = require('../commands/big-burger.js');
const git = require('../commands/git.js');

module.exports = (client) => {

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.commandName) {

            case 'ping':

                await interaction.reply(italic(bold(ping.result())));

                break;
            case 'big-burger':

                const res = burger.result();
                if (res)
                    await interaction.reply(res);

                break;
            case 'git':

                await interaction.reply(git.result());

                break;
        }
    });

    // Add all commands here !
    return [
        ping.PING_COMMAND,
        burger.BURGER_COMMAND,
        git.GIT_COMMAND
    ];
}