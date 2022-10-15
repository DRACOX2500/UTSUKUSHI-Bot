import { BotClient } from 'src/BotClient';
import { UtsukushiEvent } from '@models/utsukushi-interaction.model';
import { Guild } from 'discord.js';
import { BotCacheGlobalGuildEmoji } from '@models/firebase/document-data.model';
import { blue } from 'ansicolor';

class EmojiListUpdateEvent implements UtsukushiEvent {

	private async updateGuildEmojiListInDatabase(guild: Guild, client: BotClient) {
		const guildCache = await client.getDatabase().getCacheByGuild(guild);
		if (!guildCache || !guildCache.shareEmojis) return;

		const emojis = await guild.emojis.fetch();
		const emojiArray = [...emojis.values()].map(emoji => {
			return <BotCacheGlobalGuildEmoji>{
				animated: emoji.animated,
				id: emoji.id,
				name: emoji.name,
			};
		});

		console.log(blue(`Update ${emojiArray.length} Emojis from ${guild.name}#${guild.id}`));
		await client.getDatabase().deleteCacheGlobalEmoji(...emojiArray);
		await client.getDatabase().setCacheGlobalEmoji(...emojiArray);
	}

	readonly event = async (client: BotClient): Promise<void> => {
		client.on('emojiCreate', (emoji) => {
			const guild = emoji.guild;
			this.updateGuildEmojiListInDatabase(guild, client);
		});
		client.on('emojiUpdate', (oldEmoji, emoji) => {
			const guild = emoji.guild;
			this.updateGuildEmojiListInDatabase(guild, client);
		});
		client.on('emojiDelete', (emoji) => {
			const guild = emoji.guild;
			this.updateGuildEmojiListInDatabase(guild, client);
		});
	};
}

export default new EmojiListUpdateEvent();