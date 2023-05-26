import { UtsukushiClient } from 'src/utsukushi-client';
import { UtsukushiEvent } from '@models/utsukushi-interaction.model';
import { Guild, GuildEmoji } from 'discord.js';
import { GlobalDataEmoji } from '@models/firebase/document-data.model';
import { logger } from 'root/src/modules/system/logger/logger';

class EmojiListUpdateEvent implements UtsukushiEvent {

	private async updateGuildEmojiListInDatabase(guild: Guild, client: UtsukushiClient, target?: GuildEmoji) {
		const guildCache = await client.getDatabase().guilds.getByKey(guild.id);
		if (!guildCache?.value.shareEmojis) return;

		const emojis = await guild.emojis.fetch();
		const emojiArray = [...emojis.values()].map(emoji => {
			return <GlobalDataEmoji>{
				animated: emoji.animated,
				id: emoji.id,
				name: emoji.name,
			};
		});


		if (target) {
			const old = [...emojiArray, <GlobalDataEmoji>{ animated: target.animated, id: target.id, name: target.name }];
			await client.getDatabase().global.deleteEmojis(old);
		}
		await client.getDatabase().global.setEmojis(emojiArray);
	}

	readonly event = async (client: UtsukushiClient): Promise<void> => {
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

export default new EmojiListUpdateEvent();