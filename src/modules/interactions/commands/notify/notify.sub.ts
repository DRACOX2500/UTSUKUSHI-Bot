import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { UtsukushiClient } from 'src/utsukushi-client';

export interface NotifyCommandOptions {
	channel: string;
}

export class NotifySubCommand {
	protected async off(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiClient
	) {
		if (!interaction.guild) {
			interaction.reply('❌ Channel setup Failed !');
			return;
		}
		await interaction.deferReply();
		client
			.getDatabase()
			.guilds.set(interaction.guild.id, { vocalNotifyChannel: null });
		interaction.editReply('🔕 Notify Channel Removed successfully !');
	}
	protected async on(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiClient,
		options: NotifyCommandOptions
	) {
		if (!interaction.guild) {
			interaction.reply('❌ Channel setup Failed !');
			return;
		}
		await interaction.deferReply();
		client.getDatabase().guilds.set(interaction.guild.id, {
			vocalNotifyChannel: options.channel,
		});
		interaction.editReply('🔔 Channel setup successfully !');
	}
}
