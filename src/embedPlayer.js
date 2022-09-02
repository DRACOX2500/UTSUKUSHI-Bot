const { EmbedBuilder, time } = require('discord.js');
const { minuteSecondsFormater } = require('./utils/secondsToMinuteSecondsFormat.js');

const { LOGO_MUSIC_BLUE, LOGO_MUSIC_PURPLE } = require('./utils/logo.js');

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
			)
			.setImage(this.thumbnailUrl)
			.setTimestamp()
			.setFooter({ text: 'Youtube', iconURL: LOGO_MUSIC_PURPLE });
	}
}

exports.EmbedPlayer = EmbedPlayer;