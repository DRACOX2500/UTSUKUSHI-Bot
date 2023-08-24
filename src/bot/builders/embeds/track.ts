import { type Track } from 'discord-player';
import { EmbedBuilder, userMention } from 'discord.js';
import { COLOR, MUSIC_BLUE, GIT_ASSETS } from '../../../constants';

export class TrackEmbed extends EmbedBuilder {

	constructor(track: Track) {
		super();

		if (track.requestedBy) this.addFields({
			name: 'Added By :',
			value: userMention(track.requestedBy?.id ?? ''),
			inline: true,
		});

		this
			.setColor(COLOR[`${track.source}_dark`])
			.setTitle(track.title)
			.setURL(track.url)
			.setDescription('🎶 🎵 🎶 🎵 🎶')
			.setAuthor({
				name: track.author,
				iconURL: MUSIC_BLUE,
			})
			.addFields(
				{
					name: 'Duration :',
					value: track.duration,
					inline: true,
				},
			)
			.setImage(track.thumbnail)
			.setTimestamp()
			.setFooter({ text: track.raw.source ?? 'unknown', iconURL: `${GIT_ASSETS}/${track.source}.png` });

		if (track.views > 0) this.addFields({
			name: 'Views :',
			value: track.views.toString(),
			inline: true,
		});
	}
}