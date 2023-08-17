import { BotClient } from "@/core/bot-client";
import { Attachment, EmbedBuilder } from "discord.js";

export class SpeakAsBotEmbed extends EmbedBuilder {

	constructor(client: BotClient, desc: string, attachments: Attachment[] = []) {
        super();


        this
            .setAuthor({ name: client.user?.username ?? '', iconURL: <string>client.user?.avatarURL() })
            .setDescription(desc);

        if (attachments.length) {
            attachments
                .filter(_attachment => _attachment.contentType?.startsWith('image/'))
                .forEach(_attachment => this.setImage(_attachment.url));

            this.setFooter({ text: `+ ${attachments.length} attachment(s)` })
        }
	}
}