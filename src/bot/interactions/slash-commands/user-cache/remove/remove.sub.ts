import { BotSubSlashCommand } from "@/core/bot-command";
import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { ERROR_CMD_GUILD, ERROR_COMMAND } from "@/core/constants";
import { UtsukushiBotClient } from "@/bot/client";

/**
 * @SubSlashCommand `remove`
 *  - `remove` : remove user data
 */
export class RemoveSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('remove')
			.setDescription('Remove your data from database 💥!');
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient
	): Promise<void> {
		const user = interaction.user;
		if (!user) {
			await interaction.reply({ content: ERROR_CMD_GUILD, ephemeral: true });
            throw new Error(ERROR_COMMAND);
		}

		await interaction.deferReply({ ephemeral: true });

		client.store.users.removeDoc(user)
			.then(() => {
				client.store.users.remove(user.id);
				interaction.editReply('✅ User data removed successfully !');
			})
			.catch(() => interaction.editReply('❌ Failed to remove User data !'));
	};
}
