/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedBuilder, time, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { Converter } from '@utils/converter';
import { EmbedVideoData } from '@models/embeds/embed-video-datav';
import { LOGO_MUSIC_BLUE, LOGO_SOURCES } from 'src/constant';
import { VolumeButtons } from '@modules/interactions/buttons/play/volume.button';
import { StopButton } from '@modules/interactions/buttons/play/stop.button';
import { PauseButton } from '@modules/interactions/buttons/play/pause.button';
import { SkipButton } from '@modules/interactions/buttons/play/skip.button';

export namespace PlayerEmbed {

	abstract class AbstractPlayerEmbed {
		volumeOpti = false;
		getButtonMenu() {
			return new ActionRowBuilder<ButtonBuilder>().addComponents(
				new VolumeButtons.VolumeDownButton().button(this.volumeOpti),

				new StopButton().button(),

				new PauseButton().button(),

				new SkipButton().button(true),

				new VolumeButtons.VolumeUpButton().button(this.volumeOpti)
			);
		}
	}

	export class YoutubePlayerEmbed extends AbstractPlayerEmbed {
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

		constructor(data: any, volumeOpti = false) {
			super();
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
						value: Converter.secondsToMinutesSecondsFormat(this.data.duration),
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
	}
}