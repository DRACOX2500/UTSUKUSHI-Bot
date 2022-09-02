/* eslint-disable curly */
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const TWITCH_LINK = 'https://www.twitch.tv/*';

class BotClient extends Client {

	constructor(config) {
		super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

		this.token = config.token;
		this.clientID = config.clientID;
		this.player = null;
		this.connection = null;

		this.ready();
	}

	ready() {

		this.on('ready', () => {
			console.log(`Logged in as ${this.user.tag}!`);
			this.user?.setActivity(':]', { type: ActivityType.Streaming, url: TWITCH_LINK });
			this.user?.setStatus('idle');
		});
		this.on('error', console.error);
		this.on('warn', console.warn);
	}

	setActivity(activity) {
		this.user?.setActivity(activity.status, { type: activity.type, url: TWITCH_LINK });
	}

	setVocalConnection(connection) {
		this.connection = connection;
		this.connection?.on('stateChange', (oldState, newState) => {
			console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
		});

		this.connection?.on('error', error => {
			console.error('[Connection] Error:', error.message);
		});
	}

	joinVocalChannel(channel) {

		// Connection to voice channel
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		this.setVocalConnection(connection);
	}

	async playMusic(stream) {

		this.setPlayer(createAudioPlayer());
		const resource = createAudioResource(stream);

		this.connection.subscribe(this.player);

		console.log('Play started');
		this.player.play(resource);
	}

	setPlayer(player) {
		this.player = player;
		this.player.on('stateChange', (oldState, newState) => {
			console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
			if (newState.status === 'idle') {
				console.error('Track finished playing');
				this.killConnection();
			}
		});

		player.on('error', error => {
			console.error('[Player] Error:', error.message);
		});
	}

	killConnection() {
		if (this.player)
			this.player.stop();

		if (this.connection)
			this.connection.destroy();

		console.log('Connection closed !');
		this.player = null;
		this.connection = null;
	}

}

exports.BotClient = BotClient;