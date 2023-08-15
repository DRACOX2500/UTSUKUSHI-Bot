import { UtsukushiBotClient } from "@/bot/client";
import { logger } from "@/core/logger";
import { BotTrigger } from "@/core/types/bot-interaction";
import { Guild, GuildEmoji } from "discord.js";

class EmojiListUpdateTrigger implements BotTrigger<UtsukushiBotClient> {

	private async updateGuildEmojiListInDatabase(guild: Guild, client: UtsukushiBotClient, target?: GuildEmoji) {
		const _guild = await client.store.guilds.getOrCreate(guild);
		if (!_guild.emojisShared) return;

		const emojis = await guild.emojis.fetch();
		const emojiArray = [...emojis.values()].map(emoji => ({
			animated: emoji.animated,
			id: emoji.id,
			name: emoji.name,
		}));

		// TODO: add / update / remove emojis
		// if (target) {
		// 	const old = [...emojiArray, { animated: target.animated, id: target.id, name: target.name }];
		// 	await client.store.deleteEmojis(old);
		// }
		// await client.data.global.setEmojis(emojiArray);
	}

	readonly trigger = async (client: UtsukushiBotClient): Promise<void> => {
		client.on('emojiCreate', (emoji) => {
			const guild = emoji.guild;
			this.updateGuildEmojiListInDatabase(guild, client).catch((err: Error) => logger.error({}, err.message));
		});
		client.on('emojiUpdate', (oldEmoji, emoji) => {
			const guild = emoji.guild;
			this.updateGuildEmojiListInDatabase(guild, client, oldEmoji).catch((err: Error) => logger.error({}, err.message));
		});
		client.on('emojiDelete', (emoji) => {
			const guild = emoji.guild;
			this.updateGuildEmojiListInDatabase(guild, client, emoji).catch((err: Error) => logger.error({}, err.message));
		});
	};
}

export const trigger = new EmojiListUpdateTrigger();