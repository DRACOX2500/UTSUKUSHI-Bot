import { UtsukushiSlashCommand } from '@models/UtsukushiCommand';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { EmbedGuild } from 'root/src/modules/system/embeds/guild.embed';
import { BotClient } from 'src/BotClient';

/**
 * @SlashCommand `guild`
 *  - `guild` : get guild informations
 */
export class GuildCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('guild')
		.setDescription('Guild informations')
		.setDMPermission(false);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {
		const guild = interaction.guild;
		if (!guild) return;

		await interaction.deferReply();

		const embed = new EmbedGuild(guild, client);
		const em = await embed.getEmbed();
		const emExtra = await embed.getEmbedExtra();
		await interaction.editReply({ embeds: [em, emExtra] });
	};
}
export const command = new GuildCommand();
