import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { BotClient } from '@class/BotClient';

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

		const m = <GuildMember>interaction.member;
		if (!m.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
			interaction.reply('🔒 You do not have permission to manage the guild')
				.then(() => { setTimeout(() => interaction.deleteReply().catch(error => console.log(error.message)), 3000); },);
			return;
		}

		await interaction.deferReply();
		const channelId = <string | null>interaction.options.get('channel')?.value;

		if (interaction.guild && channelId) {
			const channelIdInCache = await client.getDatabase().getCacheByGuild(interaction.guild);

			if (channelIdInCache?.vocalNotifyChannel === channelId) {
				client.getDatabase().setCacheByGuild(interaction.guild, { vocalNotifyChannel:  null });
				interaction.editReply('🔕 Notify Channel Removed successfully !');
			}
			else {
				client.getDatabase().setCacheByGuild(interaction.guild, { vocalNotifyChannel:  channelId });
				interaction.editReply('🔔 Channel setup successfully !');
			}
		}
		else {
			interaction.editReply('❌ Channel setup Failed !');
		}

	};

}