import {
	bold,
	CacheType,
	SelectMenuComponentOptionData,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder,
} from 'discord.js';
import { GlobalDataEmoji } from '@models/firebase/document-data.model';
import { logger } from 'root/src/modules/system/logger/logger';

export class ReactAsBotSelect extends StringSelectMenuBuilder {
	constructor(
		private emojis: GlobalDataEmoji[],
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
			.addOptions(<StringSelectMenuOptionBuilder>(<unknown>selectOptions));

		if (this.emojis.length < 5) this.setMaxValues(this.emojis.length);
		if (this.emojis.length === 0) this.setMaxValues(0).setMinValues(0);
	}

	static async getEffect(
		interaction: StringSelectMenuInteraction<CacheType>
	): Promise<void> {
		const mes = interaction.message;
		const targetId = mes.content.split('[#')[1].split('](')[0];
		if (!targetId || !interaction.channel) {
			interaction.deferUpdate().catch((err: Error) => logger.error({}, err.message));
			return;
		}
		const mesTarget = await interaction.channel.messages.fetch(targetId);
		interaction.values.forEach((value) => {
			mesTarget.react(value).catch((error: Error) => {
				if (error.message === 'Unknown Emoji') {
					const emojiName = value.split(':')[1];
					interaction.followUp({ content: `❌ This emoji (${bold(emojiName)}) is not supported !`, ephemeral: true }).catch((err: Error) => logger.error({}, err.message));
				}
			});
		});
		interaction.deferUpdate().catch((err: Error) => logger.error({}, err.message));
	}
}
