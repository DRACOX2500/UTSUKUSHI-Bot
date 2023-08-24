import { type UtsukushiBotClient } from '../../../bot/client';
import { type BotTrigger } from '../../../core/types/bot-interaction';
import { type Emoji } from '../../../types/business';
import { type GuildEmoji } from 'discord.js';

class EmojiListUpdateTrigger implements BotTrigger<UtsukushiBotClient> {

	private toEmojiType(emoji: GuildEmoji): Emoji {
		return {
			animated: emoji.animated ?? false,
			id: emoji.id,
			name: emoji.name ?? '',
		};
	}

	async trigger(client: UtsukushiBotClient): Promise<void> {
		client.on('emojiCreate', (emoji) => {
			client.store.guilds.addEmoji(emoji.guild, this.toEmojiType(emoji));
		});
		client.on('emojiUpdate', (oldEmoji, emoji) => {
			client.store.guilds.updateEmoji(emoji.guild, oldEmoji.id, this.toEmojiType(emoji));
		});
		client.on('emojiDelete', (emoji) => {
			client.store.guilds.removeEmoji(emoji.guild, this.toEmojiType(emoji));
		});
	};
}

export const trigger = new EmojiListUpdateTrigger();