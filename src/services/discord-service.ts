import { REGEX_LINK } from '../constants';
import { Array } from '../core/utils/array';
import { type Emoji } from '../types/business';
import { Locale, type GuildEmoji } from 'discord.js';

export class DiscordService {
	static limitAutoCompletion(list: any[]): any[] {
		return Array.limit(list, 25);
	}

	static limitText(text: string, limit: number = 1999): string {
		if (text.length > limit) return text.slice(0, limit);
		return text;
	}

	static get languages(): string[] {
		const choices: string[] = [];
		for (const key in Locale) {
			choices.push(key);
		}
		choices.sort((a, b) => a.localeCompare(b));
		return choices;
	}

	static toEmojiType(...emojis: GuildEmoji[]): Emoji[] {
		return emojis.map((emoji): Emoji => ({
			id: emoji.id,
			name: emoji.name ?? '',
			animated: emoji.animated ?? false,
		}));
	}

	static getMessageIdFromLink(link: string): string {
		return link.split('/').pop() ?? '';
	}

	static findFirstLink(content: string): string | null {
		const regexStart = REGEX_LINK.exec(content);
		if (!regexStart) return null;

		const regexEnd = / with/.exec(regexStart[0]);
		return regexStart[0].substring(0, regexEnd?.index);
	}

	static getStart(content: string, size: number): number {
		return +content.split('(**')[1].split('** to **')[0];
	}
}