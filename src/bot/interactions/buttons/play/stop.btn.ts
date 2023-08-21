import { ButtonInteraction, CacheType } from "discord.js";
import { BotButton } from "../../../../core/bot-command";
import { UtsukushiBotClient } from "../../../client";
import { PlayerService } from "../../../../services/player-service";
import { StopButton } from "../../../builders/buttons/stop";


class Button extends BotButton<UtsukushiBotClient> {
    button = new StopButton('track-stop');
    override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
        const guild = interaction.guild;

        if (guild) {
            PlayerService.stop(guild);
        }
        await interaction.deferUpdate();
    }
}

export const button = new Button();