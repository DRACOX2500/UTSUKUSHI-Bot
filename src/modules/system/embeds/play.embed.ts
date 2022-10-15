/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedBuilder, time, ActionRowBuilder } from 'discord.js';
import { minuteSecondsFormater } from '@utils/secondsToMinuteSecondsFormat';
import { EmbedVideoData } from 'src/models/embeds/EmbedVideoData';
import { LOGO_MUSIC_BLUE, LOGO_SOURCES } from '@utils/const';
import { VolumeButtons } from '@modules/interactions/buttons/play/volume.button';
import { StopButton } from '@modules/interactions/buttons/play/stop.button';
import { PauseButton } from '@modules/interactions/buttons/play/pause.button';
import { SkipButton } from '@modules/interactions/buttons/play/skip.button';

export class EmbedPlayer {
	data: EmbedVideoData = {
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
		this.data.category =
			data.player_response.microformat.playerMicroformatRenderer.category;
		this.data.publishDate = new Date(
			data.player_response.microformat.playerMicroformatRenderer.publishDate
		);
		this.data.videoUrl = data.videoDetails.video_url;
		this.data.videoLikeCount = data.videoDetails.likes?.toString() || '-1';
		this.data.thumbnailUrl = data.videoDetails.thumbnails[3].url;

		this.data.author = data.videoDetails.author.name;
		this.data.authorLink = data.videoDetails.author.channel_url;
		this.data.authorThumbnail = data.videoDetails.author.thumbnails[2].url;

		this.data.volume = '100';
		this.volumeOpti = volumeOpti;
	}

	getEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle(this.data.title)
			.setURL(this.data.videoUrl)
			.setDescription('🎶 🎵 🎶 🎵 🎶')
			.setThumbnail(this.data.authorThumbnail)
			.setAuthor({
				name: this.data.author,
				iconURL: LOGO_MUSIC_BLUE,
				url: this.data.authorLink,
			})
			.addFields(
				{
					name: 'Duration :',
					value: minuteSecondsFormater(this.data.duration),
					inline: true,
				},
				{ name: 'Views :', value: this.data.view, inline: true },
				{ name: 'Category :', value: this.data.category, inline: true },
				{ name: 'Publish :', value: time(this.data.publishDate), inline: true },
				{ name: 'Likes :', value: this.data.videoLikeCount, inline: true },
				{
					name: 'Volume :',
					value: this.data.volume.toString() + '%',
					inline: true,
				}
			)
			.setImage(this.data.thumbnailUrl)
			.setTimestamp()
			.setFooter({ text: 'Youtube', iconURL: LOGO_SOURCES.YOUTUBE });
	}

	getButtonMenu() {
		return new ActionRowBuilder().addComponents(
			new VolumeButtons.VolumeDownButton().button(this.volumeOpti),

			new StopButton().button(),

			new PauseButton().button(),

			new SkipButton().button(true),

			new VolumeButtons.VolumeUpButton().button(this.volumeOpti)
		);
	}
}
