import { SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuOptionBuilder } from 'discord.js';
import { BotCacheGlobalGuildEmoji } from 'root/src/models/database/BotCache';

export class ReactAsBotSelect extends SelectMenuBuilder {

	constructor(
        private emojis: BotCacheGlobalGuildEmoji[],
        limit: number,
        start: number
	) {
		super();
		if (start < 0) start = 0;
		if (limit > start + 24) limit = start + 24;
		const selectOptions: Omit<SelectMenuComponentOptionData, 'default' | 'description'>[] = [];
		console.log(start, ' - ', limit);
		if	(limit <= (this.emojis.length - 1))
			this.emojis = this.emojis.slice(start, limit);

		this.emojis.forEach((item) => {
			selectOptions.push({ label: <string>item.name, value: <string>item.id, emoji: item });
		});
		this.setCustomId('react-as-bot-select')
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(5)
			.addOptions(<SelectMenuOptionBuilder><unknown>selectOptions);

		if (this.emojis.length < 5) this.setMaxValues(this.emojis.length);
		if (this.emojis.length === 0) this.setMaxValues(0).setMinValues(0);
	}
}