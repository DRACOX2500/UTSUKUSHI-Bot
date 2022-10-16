import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionsBitField,
} from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiSlashCommand } from '@models/utsukushi-command.model';
import { GlobalDataEmoji } from '@models/firebase/document-data.model';

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

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: BotClient
	): Promise<void> => {
		const guild = interaction.guild;
		const option = interaction.options.getBoolean('on-off') ?? null;
		if (!guild || option === null) {
			await interaction.reply({
				content: '❌ Options Failed !',
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply({ ephemeral: true });
		const emojis = await guild.emojis.fetch();
		const arrayEmojis: GlobalDataEmoji[] = [];
		emojis.forEach((e) =>
			arrayEmojis.push({
				id: e.id,
				name: e.name ?? undefined,
				animated: e.animated ?? undefined,
			})
		);
		if (option) {
			const res = await client
				.getDatabase()
				.global.setEmojis(arrayEmojis);
			if (res) {
				await interaction.editReply({
					content: '✅ Emojis added to database successfully !',
				});
				client.getDatabase().guilds.set(guild.id, { shareEmojis: true });
			}
			else
				await interaction.editReply({
					content: '❌ Emojis added to database failed !',
				});
		}
		else {
			const res = await client
				.getDatabase()
				.global.deleteEmojis(arrayEmojis);

			if (res) {
				await interaction.editReply({
					content: '✅ Emojis deleted to database successfully !',
				});
				client.getDatabase().guilds.set(guild.id, { shareEmojis: false });
			}
			else
				await interaction.editReply({
					content: '❌ Emojis deleted to database failed !',
				});
		}
	};
}
export const command = new GuildShareEmojiCommand();
