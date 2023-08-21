import { ButtonStyle } from "discord.js";
import { BotButtonBuilder } from "../../../core/bot-command";

export class VolumeDownButton extends BotButtonBuilder {
    constructor(id: string, disable: boolean = false) {
        super(id, disable);

        this
            .setEmoji('<:vold:937333517258469416>')
            .setStyle(ButtonStyle.Secondary);
    }
}