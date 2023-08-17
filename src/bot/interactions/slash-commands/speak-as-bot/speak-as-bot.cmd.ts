import { CancelButton } from "@/bot/builders/buttons/cancel";
import { ConfirmButton } from "@/bot/builders/buttons/confirm";
import { SpeakAsBotEmbed } from "@/bot/builders/embeds/speak-as-bot";
import { UtsukushiBotClient } from "@/bot/client";
import { BotSlashCommand } from "@/core/bot-command";
import { DiscordService } from "@/services/discord-service";
import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder } from "discord.js";

/**
 * @SlashCommand `speak-as-bot`
 *  - `speak-as-bot` : Send a message as Utsukushi bot !
 */
class SpeakAsBotCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super();

		this.command
			.setName('speak-as-bot')
			.setDescription('Send a message as Utsukushi 🪧!')
            .setDMPermission(true)
            .addStringOption((option) =>
                option
                    .setName('message')
                    .setDescription('The message you want Utsukushi to say')
                    .setRequired(true)
            )
            .addAttachmentOption((option) =>
                option
                    .setName('attachment')
                    .setDescription('The attachment you want Utsukushi to attach to the message')
            );
	}

    override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<void> {
        const option = interaction.options.getString('message', true);
		const message = DiscordService.limitText(option, 1950);

        const option2 = interaction.options.getAttachment('attachment');
		const attachment = option2 ? [option2] : [];

		await interaction.deferReply({ ephemeral: true });

		const userId = interaction.user.id;
		client.store.clipboard[userId] = { message: message, attachments: attachment };

		const embeds = [new SpeakAsBotEmbed(client, message, attachment)];

        const buttons: ButtonBuilder[] = [
            new ConfirmButton('sab-confirm'),
            new CancelButton('sab-cancel')
        ];

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(...buttons);

		await interaction.editReply({ content: 'Do you confirm that you want to send this message ?', embeds, components: [row] });
    }
}

export const command = new SpeakAsBotCommand();