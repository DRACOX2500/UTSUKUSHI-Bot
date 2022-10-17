import { UtsukushiSlashCommand } from '@models/utsukushi-command.model';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { GuildEmbed } from '@modules/system/embeds/guild.embed';
import { UtsukushiClient } from 'src/utsukushi-client';

/**
 * @SlashCommand `guild`
 *  - `guild` : get guild informations
 */
export class GuildCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('guild')
		.setDescription('Guild informations 🏛️ !')
		.setDMPermission(false);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const guild = interaction.guild;
		if (!guild) return;

		await interaction.deferReply();

		const embed = new GuildEmbed(guild, client);
		const em = await embed.getEmbed();
		const emExtra = await embed.getEmbedExtra();
		await interaction.editReply({ embeds: [em, emExtra] });
	};
}
export const command = new GuildCommand();
