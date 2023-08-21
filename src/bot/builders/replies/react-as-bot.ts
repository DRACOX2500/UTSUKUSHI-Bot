import { WebhookMessageEditOptions, TextBasedChannel, Message, messageLink, bold, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder } from "discord.js";
import { Sort } from "../../../core/utils/sort";
import { NextButton } from "../buttons/next";
import { PreviousButton } from "../buttons/previous";
import { ReactAsBotSelect } from "../selects/react-as-bot";
import { Array } from "../../../core/utils/array";
import { Emoji } from "../../../types/business";


export class ReactAsBotReply implements WebhookMessageEditOptions {
    content: string;
	components: any[];

    constructor(
        channel: TextBasedChannel,
        message: Message,
        emojisList: Emoji[],
        start: number = 0
    ) {
        emojisList.sort((a, b) => Sort.byName(a.name, b.name));
        const emojis = Array.limit(emojisList, 25, start);

        const [_start, end] = this.getSelectorLimit(start, emojis.length);

        this.content =
        `React to message ${messageLink(channel.id, message.id)} with an emoji 👍!\n` +
        `Choose an emoji ! (${bold((start + 1).toString())} to ${bold(end.toString())} - ${emojisList.length})`

        this.components = [
            new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new ReactAsBotSelect('rcab-select', emojis)
			),
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new PreviousButton('rcab-prev', start <= 0),
                new NextButton('rcab-next', (end + 1) >= emojisList.length - 1)
            )
        ]
    }

    private getSelectorLimit(_start: number, size: number): [number, number] {
        let start = _start;
        let end = start + size;
        return [start, end];
    }
}