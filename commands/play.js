const { SlashCommandBuilder } = require('discord.js');
const { EmbedPlayer } = require('../src/embedPlayer.js');

const play = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play Music 🎵!')
	.addStringOption(option =>
		option.setName('song')
			.setDescription('The Song you want to play')
			.setRequired(true));

exports.PLAY_MUSIC_COMMAND = play;

exports.result = async (interaction, client) => {

	const channel = interaction.member.voice.channel;
	if (!channel) return interaction.reply('❌ You are not in a voice channel');

	await interaction.deferReply();

	const { YtbStream } = require('../src/ytbStream');

	const url = interaction.options.get('song').value;
	const stream = new YtbStream();
	await stream.init(url);

	if (!stream.source.found)
		return interaction.editReply('❌ Music not found !');

	stream.setInfoEvent(async (info) => {
		const embedPlayer = new EmbedPlayer(info);

		const embed = embedPlayer.getEmbed();
		const comp = embedPlayer.getButtonMenu();
		return interaction.editReply({ embeds: [embed], components: [comp] });
	});

	client.joinVocalChannel(channel);
	await client.playMusic(stream.get());

};