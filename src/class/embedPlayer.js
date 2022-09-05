const { EmbedBuilder, time, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { minuteSecondsFormater } = require('../utils/secondsToMinuteSecondsFormat.js');

const LOGO_MUSIC_BLUE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/musical-notes_1f3b6.png';
const LOGO_MUSIC_PURPLE = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/multiple-musical-notes_1f3b6.png';

class EmbedPlayer {

	constructor(data) {
		this.title = data.videoDetails.title;
		this.duration = data.videoDetails.lengthSeconds;
		this.view = data.videoDetails.viewCount;
		this.category = data.player_response.microformat.playerMicroformatRenderer.category;
		this.publishDate = data.player_response.microformat.playerMicroformatRenderer.publishDate;
		this.videoUrl = data.videoDetails.video_url;
		this.videoLikeCount = data.videoDetails.likes;
		this.thumbnailUrl = data.videoDetails.thumbnails[3].url;

		this.author = data.videoDetails.author.name;
		this.authorLink = data.videoDetails.author.channel_url;
		this.authorThumbnail = data.videoDetails.author.thumbnails[2].url;

		this.volume = 100;
	}

	getEmbed() {
		return new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(this.title)
			.setURL(this.videoUrl)
			.setDescription('🎶 🎵 🎶 🎵 🎶')
			.setThumbnail(this.authorThumbnail)
			.setAuthor({ name: this.author, iconURL: LOGO_MUSIC_BLUE, url: this.authorLink })
			.addFields(
				{ name: 'Duration :', value: minuteSecondsFormater(this.duration), inline: true },
				{ name: 'Views :', value: this.view, inline: true },
				{ name: 'Category :', value: this.category, inline: true },
				{ name: 'Publish :', value: time(new Date(this.publishDate)), inline: true },
				{ name: 'Likes :', value: this.videoLikeCount.toString(), inline: true },
				{ name: 'Volume :', value: this.volume.toString() + '%', inline: true },
			)
			.setImage(this.thumbnailUrl)
			.setTimestamp()
			.setFooter({ text: 'Youtube', iconURL: LOGO_MUSIC_PURPLE });
	}

	getButtonMenu() {
		return new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('vdown')
					.setEmoji('<:vold:937333517258469416>')
					.setStyle(ButtonStyle.Secondary),

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
					.setStyle(ButtonStyle.Secondary),
			);
	}
}

exports.EmbedPlayer = EmbedPlayer;