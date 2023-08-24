import { type Track } from 'discord-player';
import { type MessageCreateOptions, type ButtonBuilder, ActionRowBuilder, type EmbedBuilder } from 'discord.js';
import { TrackEmbed } from '../embeds/track';
import { VolumeDownButton } from '../buttons/volume-down';
import { SkipButton } from '../buttons/skip';
import { StopButton } from '../buttons/stop';
import { VolumeUpButton } from '../buttons/volume-up';
import { PauseButton } from '../buttons/pause';


export class TrackReply implements MessageCreateOptions {
	embeds: EmbedBuilder[];
	components: Array<ActionRowBuilder<ButtonBuilder>>;

	constructor(
		track: Track,
	) {

		this.embeds = [
			new TrackEmbed(track),
		];

		this.components = [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new VolumeDownButton('track-volume-down'),
				new StopButton('track-stop'),
				new PauseButton('track-pause'),
				new SkipButton('track-skip'),
				new VolumeUpButton('track-volume-up'),
			),
		];
	}
}