/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UtsukushiSlashCommand } from '@models/utsukushi-command.model';
import { UtsukushiClient } from 'src/utsukushi-client';
import { DiscordTogether } from 'discord-together';
import { PLAY_TOGETHER_ACTIVITY } from 'src/constant';

type Choice = { name: string, value: string };

function getLabel(arg: {name: string, actif: boolean | null}): string {
	let state = '❌';
	if (arg.actif === null) state = '💲';
	else if (arg.actif) state = '✅';
	return `${arg.name[0].toUpperCase() + arg.name.slice(1)} ${state}`;
}

function getAllActivityChoices(): Choice[] {
	const array: Choice[] = [];
	for (const activity of PLAY_TOGETHER_ACTIVITY) {
		array.push({
			name: getLabel(activity),
			value: activity.name,
		});
	}
	return array;
}

/**
 * @SlashCommand `play-together`
 *  - `play-together [activity]` : Start Discord Voice Channel Activity
 */
export class PlayTogetherCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('play-together')
		.setDescription('Start Discord Voice Channel Activity 🎮! (🧪 experimental)')
		.setDMPermission(true)
		.addStringOption(option =>
			option
				.setName('activity')
				.setDescription('Activity you want to start')
				.setRequired(true)
				.setChoices(
					...getAllActivityChoices()
				)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const voiceChannel = (<any>interaction.member).voice.channel;
		if (!voiceChannel) {
			interaction.reply('❌ You are not in a voice channel');
			return;
		}

		const activity = interaction.options.getString('activity', true);
		client.discordTogether = new DiscordTogether(client);
		const invite: { code: string; } = await client.discordTogether.createTogetherCode((<any>interaction.member).voice.channel.id, activity);
		await interaction.reply(invite.code);
	};
}

export const command = new PlayTogetherCommand();
