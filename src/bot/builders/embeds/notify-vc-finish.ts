import { EmbedBuilder, bold, type VoiceChannel } from 'discord.js';
import { ConverterUtils } from '../../../core/utils/converter';

export class NotifyVCFinishEmbed extends EmbedBuilder {

	constructor(channel: VoiceChannel, duration: number) {
		super();

		const durationString = ConverterUtils.convertMsToTime(duration);
		const guildIconURL = channel.guild.iconURL() ?? undefined;


		this
			.setColor(0xec0041)
			.setDescription(
				`☎️ Voice channel ${bold(channel.name)} is empty \` ${durationString} \``,
			)
			.setTimestamp()
			.setFooter({ text: channel.guild.name, iconURL: guildIconURL });
	}
}