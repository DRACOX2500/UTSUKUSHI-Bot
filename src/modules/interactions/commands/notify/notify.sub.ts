import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { logger } from 'root/src/modules/system/logger/logger';
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
			interaction.reply('❌ Channel setup Failed !').catch((err: Error) => logger.error({}, err.message));
			return;
		}
		await interaction.deferReply();
		client
			.getDatabase()
			.guilds.set(interaction.guild.id, { vocalNotifyChannel: null });
		interaction.editReply('🔕 Notify Channel Removed successfully !').catch((err: Error) => logger.error({}, err.message));
	}
	protected async on(
		interaction: ChatInputCommandInteraction<CacheType>,
		client: UtsukushiClient,
		options: NotifyCommandOptions
	) {
		if (!interaction.guild) {
			interaction.reply('❌ Channel setup Failed !').catch((err: Error) => logger.error({}, err.message));
			return;
		}
		await interaction.deferReply();
		client.getDatabase().guilds.set(interaction.guild.id, {
			vocalNotifyChannel: options.channel,
		});
		interaction.editReply('🔔 Channel setup successfully !').catch((err: Error) => logger.error({}, err.message));
	}
}
