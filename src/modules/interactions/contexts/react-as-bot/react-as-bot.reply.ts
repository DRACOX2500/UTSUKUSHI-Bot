/* eslint-disable no-empty-function */
import {
	WebhookEditMessageOptions,
	ActionRowBuilder,
	APIMessageComponentEmoji,
	SelectMenuBuilder,
	ButtonBuilder,
	bold,
	hyperlink,
} from 'discord.js';
import { ReactAsBotSelect } from '@modules/interactions/selects/react-as-bot/react-as-bot.select';
import { ReactAsBotButtons } from '@modules/interactions/buttons/react-as-bot/emoji-pagination.button';
import { Sort } from '@utils/sort';

export class ReactAsBotContextReply implements WebhookEditMessageOptions {
	content!: string;
	readonly components;

	constructor(
		private targetId: string,
		private targetUrl: string,
		private emojis: APIMessageComponentEmoji[],
		private start = 0
	) {
		let limit = start + 24;
		if (this.start < 0) start = 0;
		if (this.start >= this.emojis.length - 1) this.start = this.emojis.length - 2;
		if (limit <= this.start) limit = this.start + 1;
		if (limit > start + 24) limit = start + 24;
		if (limit > this.emojis.length - 1) limit = this.emojis.length - 1;
		if (this.start < 0) {
			this.start = 0;
			limit = start + 24;
		}
		emojis.sort((a, b) => { return Sort.byName(<string>a.name, <string>b.name); });
		this.content =
			`React to message ${(hyperlink('#' + this.targetId, this.targetUrl))} with an emoji 👍!\n` +
			`Choose an emoji ! (${bold(String(this.start + 1))} to ${bold(String(limit + 1))} - ${
				this.emojis.length
			})`;
		this.components = [
			new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new ReactAsBotSelect(this.emojis, limit, this.start)
			),
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ReactAsBotButtons.PreviousButton().button(
					this.start <= 0 ? true : false
				),
				new ReactAsBotButtons.NextButton().button(
					limit >= this.emojis.length - 1 ? true : false
				)
			),
		];
	}
}
