/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedBuilder, time, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import { minuteSecondsFormater } from '../utils/secondsToMinuteSecondsFormat';
import { EmbedData } from '../model/EmbedData';
import { LOGO_MUSIC_BLUE, LOGO_MUSIC_PURPLE } from '../utils/const';

export class EmbedPlayer {

	data: EmbedData = {
		title: '',
		duration: 0,
		view: '',
		category: '',
		publishDate: new Date(),
		videoUrl: '',
		videoLikeCount: '',
		thumbnailUrl: '',

		author: '',
		authorLink: '',
		authorThumbnail: '',

		volume: 0,
	};

	volumeOpti = false;

	constructor(data: any, volumeOpti = false) {
		this.data.title = data.videoDetails.title;
		this.data.duration = data.videoDetails.lengthSeconds;
		this.data.view = data.videoDetails.viewCount;
		this.data.category = data.player_response.microformat.playerMicroformatRenderer.category;
		this.data.publishDate = new Date(data.player_response.microformat.playerMicroformatRenderer.publishDate);
		this.data.videoUrl = data.videoDetails.video_url;
		this.data.videoLikeCount = data.videoDetails.likes.toString() || '-1';
		this.data.thumbnailUrl = data.videoDetails.thumbnails[3].url;

		this.data.author = data.videoDetails.author.name;
		this.data.authorLink = data.videoDetails.author.channel_url;
		this.data.authorThumbnail = data.videoDetails.author.thumbnails[2].url;

		this.data.volume = '100';
		this.volumeOpti = volumeOpti;
	}

	getEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(this.data.title)
			.setURL(this.data.videoUrl)
			.setDescription('🎶 🎵 🎶 🎵 🎶')
			.setThumbnail(this.data.authorThumbnail)
			.setAuthor({ name: this.data.author, iconURL: LOGO_MUSIC_BLUE, url: this.data.authorLink })
			.addFields(
				{ name: 'Duration :', value: minuteSecondsFormater(this.data.duration), inline: true },
				{ name: 'Views :', value: this.data.view, inline: true },
				{ name: 'Category :', value: this.data.category, inline: true },
				{ name: 'Publish :', value: time(this.data.publishDate), inline: true },
				{ name: 'Likes :', value: this.data.videoLikeCount, inline: true },
				{ name: 'Volume :', value: this.data.volume.toString() + '%', inline: true },
			)
			.setImage(this.data.thumbnailUrl)
			.setTimestamp()
			.setFooter({ text: 'Youtube', iconURL: LOGO_MUSIC_PURPLE });
	}

	getButtonMenu() {
		return new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('vdown')
					.setEmoji('<:vold:937333517258469416>')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(this.volumeOpti),

				new ButtonBuilder()
					.setCustomId('stop')
					.setEmoji('<:stop:937333534186680321>')
					.setStyle(ButtonStyle.Danger),

				new ButtonBuilder()
					.setCustomId('pause')
					.setEmoji('<:p_:937332417738473503>')
					.setStyle(ButtonStyle.Success),

				new ButtonBuilder()
					.setCustomId('skip')
					.setEmoji('<:skip:937332450953146432>')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true),

				new ButtonBuilder()
					.setCustomId('vup')
					.setEmoji('<:volp:937332469798162462>')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(this.volumeOpti),
			);
	}
}