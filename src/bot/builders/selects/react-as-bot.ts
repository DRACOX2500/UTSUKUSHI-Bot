import { BotSelectBuilder } from "@/core/bot-command";
import { Emoji } from "@/types/business";
import { APISelectMenuOption } from "discord.js";

export class ReactAsBotSelect extends BotSelectBuilder {
    constructor(id: string, emojis: Emoji[] = []) {
        super(id);

        const options: APISelectMenuOption[] = emojis.map(emoji => ({
            label: emoji.name,
            value: this.toEmojiValue(emoji),
            emoji,
        }));

        this
            .setPlaceholder('Nothing selected')
            .setMinValues(1)
            .setMaxValues(5)
            .addOptions(options);
    }

    private toEmojiValue(emoji: Emoji) {
        return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`
    }
}