import { Track } from "discord-player";
import { EmbedBuilder } from "discord.js";
import { COLOR, MUSIC_BLUE, GIT_ASSETS } from "../../../constants";


export class TrackAddedEmbed extends EmbedBuilder {

	constructor(track: Track) {
        super();

        this
            .setColor(COLOR[track.source])
            .setTitle(track.title)
            .setURL(track.url)
            .setAuthor({
                name: 'Track added !',
                iconURL: MUSIC_BLUE,
            })
            .setTimestamp()
            .setFooter({ text: track.raw.source ?? 'unknown', iconURL: `${GIT_ASSETS}/${track.source}.png` });
	}
}