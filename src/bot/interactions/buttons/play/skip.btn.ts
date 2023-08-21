import { ButtonInteraction, CacheType } from "discord.js";
import { BotButton } from "../../../../core/bot-command";
import { UtsukushiBotClient } from "../../../client";
import { PlayerService } from "../../../../services/player-service";
import { SkipButton } from "../../../builders/buttons/skip";


class Button extends BotButton<UtsukushiBotClient> {
    button = new SkipButton('track-skip');
    override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const guild = interaction.guild;

        if (guild) {
            PlayerService.skip(guild);
        }
        await interaction.deferUpdate();
    }
}

export const button = new Button();