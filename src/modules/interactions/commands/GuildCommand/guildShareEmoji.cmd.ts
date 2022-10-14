import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { BotCacheGlobalGuildEmoji } from '@models/database/BotCache';
import { UtsukushiSlashCommand } from '@models/UtsukushiCommand';

/**
 * @SlashCommand `guild`
 *  - `guild-share-emoji` : get guild informations
 */
export class GuildShareEmojiCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('guild-share-emoji')
		.setDescription('Guild share emoji with Utsukushi and other guilds 😀!')
		.setDMPermission(false)
		.addBooleanOption((option) =>
			option
				.setName('on-off')
				.setDescription('Enable or disable guild share emoji')
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild);

	readonly result = async (interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> => {
		const guild = interaction.guild;
		const option = interaction.options.getBoolean('on-off') ?? null;
		if (!guild || option === null) {
			await interaction.reply({ content: '❌ Options Failed !', ephemeral: true });
			return;
		}

		await interaction.deferReply({ ephemeral: true });
		const emojis = await guild.emojis.fetch();
		const arrayEmojis: BotCacheGlobalGuildEmoji[] = [];
		emojis.forEach(e => arrayEmojis.push({
			id: e.id,
			name: e.name ?? undefined,
			animated: e.animated ?? undefined,
		}));
		if (option) {

			const res = await client.getDatabase().setCacheGlobalEmoji(...arrayEmojis);
			if (res)
				await interaction.editReply({ content: '✅ Emojis added to database successfully !' });
			else
				await interaction.editReply({ content: '❌ Emojis added to database failed !' });
		}
		else {
			const res = await client.getDatabase().deleteCacheGlobalEmoji(...arrayEmojis);

			if (res === arrayEmojis.length)
				await interaction.editReply({ content: '✅ Emojis deleted to database successfully !' });
			else if (res <= 0)
				await interaction.editReply({ content: '❌ Emojis deleted to database failed !' });
			else
				await interaction.editReply({ content: `⏸️ Partially deleted emojis from database (${res}/${arrayEmojis.length}) !` });
		}
	};

}
export const command = new GuildShareEmojiCommand();