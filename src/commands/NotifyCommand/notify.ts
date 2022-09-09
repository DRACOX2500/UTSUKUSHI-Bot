import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from '../../class/BotClient';

export class NotifyCommand {

	static readonly slash: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> = new SlashCommandBuilder()
		.setName('notify')
		.setDescription('Notify when someone join a voice channel 🔔!')
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('The channel you want me to notify')
				.setAutocomplete(true)
				.setRequired(true));

	static readonly result = async (interaction:ChatInputCommandInteraction, client: BotClient): Promise<void> => {
		const channelId = <string | null>interaction.options.get('channel')?.value;

		if (interaction.guild) {
			client.getDatabase().setCacheByGuild(interaction.guild, { vocalNotifyChannel:  channelId });
			interaction.reply('🔔 Channel setup successfully !');
		}
		else {
			interaction.reply('🔕 Channel setup Failed !');
		}

	};

}