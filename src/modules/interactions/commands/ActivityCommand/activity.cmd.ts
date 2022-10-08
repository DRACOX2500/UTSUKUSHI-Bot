import { SlashCommandBuilder, ActivityType, SlashCommandIntegerOption, ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { Activity } from '@models/Activity';
import { TWITCH_LINK } from '@utils/const';
import { UtsukushiSlashCommand } from '@models/UtsukushiCommand';

/**
 * @SlashCommand `activity`
 *  - `activity [type] [status]` : Change Utsukushi profile activity !
 */
export class ActivityCommand implements UtsukushiSlashCommand {

	readonly command: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> = new SlashCommandBuilder()
		.setName('activity')
		.setDescription('Change bot activity 🤖!')
		.setDMPermission(true)
		.addIntegerOption((option : SlashCommandIntegerOption) =>
			option.setName('type')
				.setDescription('Type of bot activity')
				.addChoices(
					{ name: 'Play', value: ActivityType.Playing },
					{ name: 'Listen', value: ActivityType.Listening },
					{ name: 'Stream', value: ActivityType.Streaming },
					{ name: 'Competing', value: ActivityType.Competing },
					{ name: 'Watch', value: ActivityType.Watching },
				)
				.setRequired(true))
		.addStringOption(option =>
			option.setName('status')
				.setDescription('Statis of bot activity')
				.setRequired(true));

	readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> => {

		const newActivity: Activity = {
			status: interaction.options.get('status')?.value?.toString() || 'Test',
			type: <number>interaction.options.get('type')?.value || ActivityType.Playing,
			url: TWITCH_LINK,
		};

		client.setActivity(newActivity);

		client.getDatabase().setCacheGlobal({ activity: newActivity });
		interaction.reply({ content: '🤖 Bot activity has been change !', ephemeral: true });
	};
}

export const command = new ActivityCommand();