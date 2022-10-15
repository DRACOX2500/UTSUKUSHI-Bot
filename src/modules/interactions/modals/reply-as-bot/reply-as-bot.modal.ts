import {
	ActionRowBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';

export class ReplyAsBotModal extends ModalBuilder {
	constructor(targetId: string) {
		super();
		this.setCustomId('rpab-modal')
			.setTitle('Reply as bot !')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('rpab-modal-content#' + targetId)
						.setLabel('What do you want to answer?')
						.setPlaceholder('Your reply message...')
						.setMinLength(1)
						.setMaxLength(2000)
						.setStyle(TextInputStyle.Paragraph)
				)
			);
	}

	static async getEffect(interaction: ModalSubmitInteraction): Promise<void> {
		const targetId = interaction.fields.fields.at(0)?.customId.split('#')[1];
		const value = interaction.fields.fields.at(0)?.value;
		if (!value || !targetId || !interaction.channel) {
			interaction.deferUpdate();
			return;
		}
		const mes = await interaction.channel.messages.fetch(targetId);
		if (!mes) {
			interaction.reply({ content: '❌ Message not found !', ephemeral: true });
			return;
		}
		mes.reply(value);
		interaction.deferUpdate();
	}
}
