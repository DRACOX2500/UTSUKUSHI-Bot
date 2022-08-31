
const { SlashCommandBuilder, ActivityType } = require('discord.js');

const activity = new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Change bot activity')
    .addIntegerOption(option => 
        option.setName('type')
            .setDescription('Type of bot activity')
            .addChoices(
                { name: 'Play', value: ActivityType.Playing },
                { name: 'Listen', value: ActivityType.Listening },
                { name: 'Stream', value: ActivityType.Streaming },
                { name: 'Competing', value: ActivityType.Competing },
                { name: 'Watch', value: ActivityType.Watching }
                )
            .setRequired(true))
    .addStringOption(option => 
        option.setName('status')
            .setDescription('Statis of bot activity')
            .setRequired(true));

exports.ACTIVITY_COMMAND = activity;

exports.result = async (interaction,client) => {


    let newActivity = {
        status: interaction.options.get('status').value,
        type: interaction.options.get('type').value
    }

    client.setActivity(newActivity);
    await interaction.reply('🤖 Bot activity has been change !');
};