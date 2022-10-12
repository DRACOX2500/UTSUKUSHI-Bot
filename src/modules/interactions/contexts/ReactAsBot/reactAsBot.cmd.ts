import { ContextMenuCommandBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction, Message, ActionRowBuilder, SelectMenuBuilder, SelectMenuComponentOptionData } from 'discord.js';
import { BotClient } from 'src/BotClient';
import { UtsukushiMessageContextCommand } from '@models/UtsukushiCommand';
import { ReactAsBotSelect } from '@modules/system/selects/ReactAsBotSelect';

/**
 * @ContextCommand
 */
export class ReactAsBotContext implements UtsukushiMessageContextCommand {

	private targetMessage!: Message | null;

	readonly command = new ContextMenuCommandBuilder()
		.setName('React As Bot')
		.setType(ApplicationCommandType.Message)
		.setDMPermission(true);

	readonly result = async (interaction: MessageContextMenuCommandInteraction, client: BotClient): Promise<void> => {

		const channel = interaction.channel;
		if (!channel) return;

		this.targetMessage = await channel.messages.fetch(interaction.targetId);
		if (!this.targetMessage) return;
		await interaction.deferReply({ ephemeral: true });

		const emojis = await client.getDatabase().getCacheGlobalEmoji();
		if (!emojis || !emojis.length) {
			await interaction.editReply({ content: '❌ React Failed !' });
			return;
		}
		console.log(emojis);

		const row = new ActionRowBuilder<SelectMenuBuilder>()
			.addComponents(
				new ReactAsBotSelect(emojis)
			);

		await interaction.editReply({ content: 'Choose an emoji !', components: [row] });
	};
}
export const command = new ReactAsBotContext();