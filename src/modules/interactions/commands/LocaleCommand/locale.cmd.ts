import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, Locale } from 'discord.js';
import { UtsukushiSlashCommand } from '@models/UtsukushiCommand';

type Choice = {
    name: string;
    value: string;
}

export class LocaleCommand implements UtsukushiSlashCommand {

	private getAllLocale(): Choice[] {
		const choices: Choice[] = [];
		for (const key in Locale) {
			if (choices.length >= 25) continue;
			choices.push({
				name: key,
				value: key,
			});
		}
		return choices;
	}

	readonly command = new SlashCommandBuilder()
		.setName('locale')
		.setDescription('Update guild locale language (default: English-US)')
		.setDMPermission(false)
		.setDefaultMemberPermissions(
			PermissionsBitField.Flags.ManageGuild
		)
		.addStringOption((option) =>
			option
				.setName('locale')
				.setDescription('The sound effect you want to play')
				.addChoices(
					...this.getAllLocale()
				)
				.setRequired(true)
		);

	readonly result = async (interaction: ChatInputCommandInteraction): Promise<void> => {
		const guild = await interaction.guild?.fetch();
		const langage = interaction.options.getString('locale') ?? 'EnglishUS';
		const locale = Locale[langage as keyof typeof Locale];

		if (!guild || !locale) {
			interaction.reply({ content: '❌ Guild set locale Failed !', ephemeral: true });
			return;
		}

		guild.setPreferredLocale(locale);
		await interaction.reply({ content: '🌐 Guild set locale Succefully !', ephemeral: true });
	};

}
export const command = new LocaleCommand();