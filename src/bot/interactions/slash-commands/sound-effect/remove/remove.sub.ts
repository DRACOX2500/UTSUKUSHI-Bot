import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, CacheType, bold } from "discord.js";
import { BotSubSlashCommand } from "../../../../../core/bot-command";
import { UtsukushiBotClient } from "../../../../client";
import { ERROR_CMD_SONG } from "../../../../../core/constants";

/**
 * @SubSlashCommand `remove`
 */
export class RemoveSubCommand extends BotSubSlashCommand<UtsukushiBotClient> {

	override set(subcommand: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder {
		subcommand
			.setName('remove')
			.setDescription('Remove sound-effect 🔇!')
			.addStringOption(option =>
				option
					.setName('query')
					.setDescription("Sound-Effect search query")
					.setRequired(true)
					.setAutocomplete(true)
			);
		return super.set(subcommand);
	}

	async result(
		interaction: ChatInputCommandInteraction,
		client: UtsukushiBotClient
	): Promise<void> {
		let guild = interaction.guild ?? undefined;
		const query = interaction.options.getString('query', true);

		await interaction.deferReply({ ephemeral: true });

		const se = await client.store.guilds.getSoundEffect(query);

		if (se) {
			await client.store.users.removeSoundEffect(query, interaction.user);
			await interaction.editReply(`Sound-Effect ${bold(se.name)} has been delete`);
		}
		else await interaction.editReply(ERROR_CMD_SONG);
	};

	override async autocomplete(interaction: AutocompleteInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const user = interaction.user;
		const focusedOption = interaction.options.getFocused(true);

		const doc = await client.store.users.getDocById(user.id);
		if (!doc) return;
		const results = await client.store.guilds.getAllSoundEffectsByUser(doc);
        if (results.length > 0) {
            interaction.respond(
                results
                .filter(
                    (t) => focusedOption.value.length === 0 ||  t.name?.toLowerCase().includes(focusedOption.value.toLowerCase())
                )
                .slice(0, 25)
                .map((t) => ({
                    name: t.name,
                    value: t.url,
                }))
            );
        }
	}
}