const { SlashCommandBuilder } = require('discord.js');
const { YtbStream } = require('../../class/ytbStream');

const snoring = new SlashCommandBuilder()
	.setName('snoring')
	.setDescription('Snores in Vocal Channel 💤!');

exports.SNORING_COMMAND = snoring;

exports.result = async (interaction, client) => {

	const channel = interaction.member.voice.channel;
	if (!channel) return interaction.reply('🚫 I\'m not tired !');

	await interaction.deferReply();


	const url = 'https://www.youtube.com/watch?v=V4ibUx_Vg28';
	const stream = new YtbStream();
	await stream.init(url);

	stream.setInfoEvent(() => {
		return interaction.editReply('💤💤💤');
	});

	client.joinVocalChannel(channel);
	await client.playMusic(stream.get());
};