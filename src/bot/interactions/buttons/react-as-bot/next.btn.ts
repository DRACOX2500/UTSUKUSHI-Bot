import { type ButtonInteraction, type CacheType } from 'discord.js';
import { BotButton } from '../../../../core/bot-command';
import { DiscordService } from '../../../../services/discord-service';
import { NextButton } from '../../../builders/buttons/next';
import { ReactAsBotReply } from '../../../builders/replies/react-as-bot';
import { type UtsukushiBotClient } from '../../../client';


class Button extends BotButton<UtsukushiBotClient> {
	button = new NextButton('rcab-next');
	override async result(interaction: ButtonInteraction<CacheType>, client: UtsukushiBotClient): Promise<void> {
		const guild = interaction.guild;
		const channel = interaction.channel;
		const message = interaction.message;

		const link = DiscordService.findFirstLink(message.content);

		if (guild && channel && link) {
			const targetId = DiscordService.getMessageIdFromLink(link);
			const target = await channel.messages.fetch(targetId);
			const emojis = await client.store.guilds.getEmojis(guild);

			const start = DiscordService.getStart(message.content, emojis.length) + 24;

			const reply = new ReactAsBotReply(channel, target, emojis, start);
			await interaction.reply({ ...reply, ephemeral: true });
		}
		await interaction.deferUpdate();
	}
}

export const button = new Button();