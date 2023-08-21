import { ButtonStyle } from "discord.js";
import { BotButtonBuilder } from "../../../core/bot-command";

export class SkipButton extends BotButtonBuilder {
    constructor(id: string, disable: boolean = false) {
        super(id, disable);

        this
			.setEmoji('<:skip:937332450953146432>')
            .setStyle(ButtonStyle.Primary);
    }
}