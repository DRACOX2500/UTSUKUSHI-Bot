import { ActionRowBuilder, TextInputBuilder, TextInputStyle, type ModalSubmitInteraction, type CacheType } from 'discord.js';
import { BotModal } from '../../../core/bot-command';
import { type UtsukushiBotClient } from '../../client';


export class ReplyAsBotModal extends BotModal<UtsukushiBotClient> {
	constructor(targetId: string) {
		super('rpab-modal');
		this
			.setTitle('Reply as bot !')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('rpab-modal-content#' + targetId)
						.setLabel('What do you want to answer?')
						.setPlaceholder('Your reply message...')
						.setMinLength(1)
						.setMaxLength(2000)
						.setStyle(TextInputStyle.Paragraph),
				),
			);
	}

	override async result(interaction: ModalSubmitInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const targetId = interaction.fields.fields.at(0)?.customId.split('#')[1];
		const value = interaction.fields.fields.at(0)?.value;
		const channel = interaction.channel;
		if (value && targetId && channel) {
			const mes = await channel.messages.fetch(targetId);
			if (mes) await mes.reply(value);
			else await interaction.reply({ content: '❌ Message not found !', ephemeral: true });
		}
		await interaction.deferUpdate();
	}
}

export const modal = new ReplyAsBotModal('');