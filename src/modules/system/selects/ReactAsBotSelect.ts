import { SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuOptionBuilder } from 'discord.js';
import { BotCacheGlobalGuildEmoji } from 'root/src/models/database/BotCache';

export class ReactAsBotSelect extends SelectMenuBuilder {

	constructor(
        private emojis: BotCacheGlobalGuildEmoji[]
	) {
		super();
		const selectOptions: Omit<SelectMenuComponentOptionData, 'default' | 'description'>[] = [];
		emojis.forEach((item) => {
			selectOptions.push({ label: <string>item.name, value: <string>item.id, emoji: item });
		});
		this.setCustomId('select')
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(5)
			.addOptions(<SelectMenuOptionBuilder><unknown>selectOptions);

		if (emojis.length < 5) this.setMaxValues(emojis.length);
		if (emojis.length === 0) this.setMaxValues(0).setMinValues(0);
	}
}