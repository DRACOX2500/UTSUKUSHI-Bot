import { BotClient } from 'src/BotClient';
import { UtsukushiEvent } from '@models/utsukushi-interaction.model';
import { Guild } from 'discord.js';
import { GlobalDataEmoji } from '@models/firebase/document-data.model';

class EmojiListUpdateEvent implements UtsukushiEvent {

	private async updateGuildEmojiListInDatabase(guild: Guild, client: BotClient) {
		const guildCache = await client.getDatabase().guilds.getByKey(guild.id);
		if (!guildCache || !guildCache.value.shareEmojis) return;

		const emojis = await guild.emojis.fetch();
		const emojiArray = [...emojis.values()].map(emoji => {
			return <GlobalDataEmoji>{
				animated: emoji.animated,
				id: emoji.id,
				name: emoji.name,
			};
		});
		await client.getDatabase().global.deleteEmojis(emojiArray);
		await client.getDatabase().global.setEmojis(emojiArray);
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