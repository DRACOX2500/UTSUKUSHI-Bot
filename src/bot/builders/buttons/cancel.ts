import { BotButtonBuilder } from "@/core/bot-command";
import { ButtonStyle } from "discord.js";

export class CancelButton extends BotButtonBuilder {
    constructor(id: string, disable: boolean = false) {
        super(id, disable);

        this
            .setEmoji('⛔')
            .setLabel('Uh... No !')
            .setStyle(ButtonStyle.Danger);
    }
}