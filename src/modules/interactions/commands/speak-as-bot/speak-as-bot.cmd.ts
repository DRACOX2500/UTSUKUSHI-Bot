import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import { UtsukushiSlashCommand } from '@models/utsukushi-command.model';
import { UtsukushiClient } from 'src/utsukushi-client';
import { buttons } from '@modules/interactions/buttons/speak-as-bot/speak-as-bot.button';

/**
 * @SlashCommand `ping`
 *  - `ping` : Reply with pong message
 */
export class SpeakAsBotCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('speak-as-bot')
		.setDescription('Send a message as Utsukushi 🪧!')
		.setDMPermission(true)
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('The message you want Utsukushi to say')
				.setRequired(true)
		)
		.addAttachmentOption((option) =>
			option
				.setName('attachment')
				.setDescription('The attachment you want Utsukushi to attach to the message')
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction,
		client: UtsukushiClient
	): Promise<void> => {
		const message = interaction.options.getString('message', true);
		if (message.length > 1950) {
			interaction.reply({ content: '😔 Message is too long', ephemeral: true });
			return;
		}
		await interaction.deferReply({ ephemeral: true });
		const attachment = interaction.options.getAttachment('attachment');
		const attach = attachment ? [attachment] : [];

		const userId = interaction.user.id;
		client.getDatabase().tempory.set(`sab-${userId}`, { message: message, attachments: attach });

		const confirm = buttons[0].button();
		const cancel = buttons[1].button();

		const embed = new EmbedBuilder()
			.setAuthor({ name: <string>client.user?.username, iconURL: <string>client.user?.avatarURL() })
			.setDescription(message);
		if (attachment && attachment.contentType?.startsWith('image/')) embed.setImage(attachment.url);
		else if (attachment) embed.setFooter({ text: '+ attachment' });

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(confirm, cancel);

		await interaction.editReply({ content: 'Do you confirm that you want to send this message ?', embeds: [embed], components: [row] });
	};
}

export const command = new SpeakAsBotCommand();
