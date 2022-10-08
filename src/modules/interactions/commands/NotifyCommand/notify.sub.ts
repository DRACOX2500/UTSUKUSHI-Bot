import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { BotClient } from 'src/BotClient';

export interface NotifyCommandOptions {
    channel: string;
}

export class NotifySubCommand {
	protected async off(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: BotClient
	) {
		if (!interaction.guild) {
			interaction.reply('❌ Channel setup Failed !');
			return;
		}
		await interaction.deferReply();
		client
			.getDatabase()
			.setCacheByGuild(interaction.guild, { vocalNotifyChannel: null });
		interaction.editReply('🔕 Notify Channel Removed successfully !');
	}
	protected async on(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: BotClient,
		options: NotifyCommandOptions
	) {
		if (!interaction.guild) {
			interaction.reply('❌ Channel setup Failed !');
			return;
		}
		await interaction.deferReply();
		client.getDatabase().setCacheByGuild(interaction.guild, {
			vocalNotifyChannel: options.channel,
		});
		interaction.editReply('🔔 Channel setup successfully !');
	}
}
