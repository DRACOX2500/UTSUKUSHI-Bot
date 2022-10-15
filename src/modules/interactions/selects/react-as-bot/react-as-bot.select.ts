import {
	CacheType,
	SelectMenuBuilder,
	SelectMenuComponentOptionData,
	SelectMenuInteraction,
	SelectMenuOptionBuilder,
} from 'discord.js';
import { BotCacheGlobalGuildEmoji } from '@models/firebase/document-data.model';

export class ReactAsBotSelect extends SelectMenuBuilder {
	constructor(
		private emojis: BotCacheGlobalGuildEmoji[],
		limit: number,
		start: number
	) {
		super();
		if (start < 0) start = 0;
		if (limit > start + 24) limit = start + 24;
		const selectOptions: Omit<
			SelectMenuComponentOptionData,
			'default' | 'description'
		>[] = [];
		if (limit <= this.emojis.length - 1)
			this.emojis = this.emojis.slice(start, limit);

		this.emojis.forEach((item) => {
			const emojiValue = `<${item.animated ? 'a' : ''}:${item.name}:${
				item.id
			}> `;
			selectOptions.push({
				label: <string>item.name,
				value: emojiValue,
				emoji: item,
			});
		});
		this.setCustomId('rab-select')
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(5)
			.addOptions(<SelectMenuOptionBuilder>(<unknown>selectOptions));

		if (this.emojis.length < 5) this.setMaxValues(this.emojis.length);
		if (this.emojis.length === 0) this.setMaxValues(0).setMinValues(0);
	}

	static async getEffect(
		interaction: SelectMenuInteraction<CacheType>
	): Promise<void> {
		const mes = interaction.message;
		const targetId = mes.content.split('#')[1].split(' with')[0];
		if (!targetId || !interaction.channel) {
			interaction.deferUpdate();
			return;
		}
		const mesTarget = await interaction.channel.messages.fetch(targetId);
		interaction.values.forEach((value) => {
			mesTarget.react(value);
		});
		interaction.deferUpdate();
	}
}
