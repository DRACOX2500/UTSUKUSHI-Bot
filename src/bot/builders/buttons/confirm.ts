import { BotButtonBuilder } from "../../../core/bot-command";
import { ButtonStyle } from "discord.js";

export class ConfirmButton extends BotButtonBuilder {
    constructor(id: string, disable: boolean = false) {
        super(id, disable);

        this
            .setEmoji('✅')
            .setLabel('Yes, I Confirm !')
            .setStyle(ButtonStyle.Success);
    }
}