const { YtbStream } = require('../src/ytbStream');

const snoring = {
    name: 'snoring',
    description: 'Snores in Vocal Channel !',
};

exports.SNORING_COMMAND = snoring;

exports.result = async (interaction, client) => {

    const channel = interaction.member.voice.channel;
    if(!channel) return await interaction.reply("🚫 I'm not tired !");

    client.joinVocalChannel(channel);

    const url = 'https://www.youtube.com/watch?v=V4ibUx_Vg28';
    const stream = new YtbStream(url);

    client.playMusic(stream.get());
    
    await interaction.reply("💤💤💤");
};