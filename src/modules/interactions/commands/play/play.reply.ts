/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionRowBuilder, APIEmbed, ButtonBuilder, JSONEncodable, WebhookEditMessageOptions } from 'discord.js';
import { PlayerEmbed } from '@modules/system/embeds/play.embed';

export class PlayReply implements WebhookEditMessageOptions {
	readonly embeds!: (APIEmbed | JSONEncodable<APIEmbed>)[] | undefined;
	readonly components!: (ActionRowBuilder<ButtonBuilder>)[];

	constructor(
		info: any,
		platform: string,
		opti = false
	) {
		const embedPlayer = new PlayerEmbed.YoutubePlayerEmbed(info, opti);

		const embed = embedPlayer.getEmbed();
		const comp = embedPlayer.getButtonMenu();
		this.embeds = [embed];
		this.components = [comp];
	}
}