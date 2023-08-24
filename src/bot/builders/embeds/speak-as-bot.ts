import { type Attachment, EmbedBuilder } from 'discord.js';
import { type BotClient } from '../../../core/bot-client';

export class SpeakAsBotEmbed extends EmbedBuilder {

	constructor(client: BotClient, desc: string, attachments: Attachment[] = []) {
		super();


		this
			.setAuthor({ name: client.user?.username ?? '', iconURL: client.user?.avatarURL() as string })
			.setDescription(desc);

		if (attachments.length > 0) {
			attachments
				.filter(_attachment => _attachment.contentType?.startsWith('image/'))
				.forEach(_attachment => this.setImage(_attachment.url));

			this.setFooter({ text: `+ ${attachments.length} attachment(s)` });
		}
	}
}